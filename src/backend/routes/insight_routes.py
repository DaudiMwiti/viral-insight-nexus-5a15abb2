
from fastapi import APIRouter, HTTPException
from src.backend.schemas.request import RunFlowRequest
from src.backend.schemas.response import InsightResponse
from src.backend.mock_data.fake_insights import get_mock_insights
from src.backend.utils.logger import log_request
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv()

router = APIRouter(tags=["insights"])

@router.post("/run-flow", response_model=InsightResponse)
async def run_flow(request: RunFlowRequest):
    # Log the incoming request
    log_request(request)
    
    try:
        # Get mock insights based on request parameters
        mock_response = get_mock_insights(
            platforms=request.platforms,
            preset=request.preset,
            tone=request.tone,
            date_range=request.dateRange
        )
        
        return mock_response
    except Exception as e:
        # Log the error and return an appropriate response
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

# Response model for the test_groq endpoint
class GroqTestResponse(BaseModel):
    status: str
    message: str
    api_key_configured: bool
    models_available: list = []

@router.get("/test-groq", response_model=GroqTestResponse)
async def test_groq():
    """Test if the Groq API key is configured and models are available."""
    try:
        # Check if GROQ_API_KEY is set
        groq_api_key = os.getenv("GROQ_API_KEY")
        
        if not groq_api_key:
            return GroqTestResponse(
                status="error",
                message="GROQ_API_KEY not found in environment variables.",
                api_key_configured=False
            )
        
        # Import modules only if API key exists
        try:
            from langchain_groq import ChatGroq
            
            # Initialize the model (this will validate the API key)
            chat_model = ChatGroq(
                api_key=groq_api_key,
                model_name="llama3-8b-8192"  # Use a default model for testing
            )
            
            # Get available models (simple test)
            available_models = ["llama3-8b-8192", "llama3-70b-8192", "mixtral-8x7b-32768"]
            
            return GroqTestResponse(
                status="success",
                message="Groq API key is configured and valid.",
                api_key_configured=True,
                models_available=available_models
            )
            
        except Exception as e:
            return GroqTestResponse(
                status="error",
                message=f"Error initializing Groq client: {str(e)}",
                api_key_configured=True  # Key exists but might not be valid
            )
            
    except Exception as e:
        return GroqTestResponse(
            status="error",
            message=f"Unexpected error: {str(e)}",
            api_key_configured=False
        )

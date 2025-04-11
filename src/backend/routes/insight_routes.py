
from fastapi import APIRouter, HTTPException, Depends
from src.backend.schemas.request import RunFlowRequest
from src.backend.schemas.response import InsightResponse
from src.backend.utils.logger import log_request
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from src.backend.agents.run_agents import InsightPipeline
import logging

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(tags=["insights"])

# Initialize the insight pipeline
async def get_insight_pipeline():
    return InsightPipeline()

@router.post("/run-flow", response_model=InsightResponse)
async def run_flow(
    request: RunFlowRequest,
    pipeline: InsightPipeline = Depends(get_insight_pipeline)
):
    """
    Run the insight generation pipeline with the specified parameters.
    
    This endpoint orchestrates the complete flow:
    1. Scrape content from the selected platforms
    2. Analyze the content with AI
    3. Generate formatted insights
    
    Args:
        request: The parameters for the insight generation
        pipeline: The insight pipeline dependency
        
    Returns:
        InsightResponse object with generated insights
        
    Raises:
        HTTPException: If an error occurs during processing
    """
    # Log the incoming request
    log_request(request)
    
    # Check if GROQ_API_KEY is set
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured. Please set this environment variable."
        )
    
    try:
        # Extract keywords from the request (if any)
        keywords = request.keywords if hasattr(request, 'keywords') else None
        
        # Run the insight pipeline
        response = await pipeline.run(
            platforms=request.platforms,
            preset=request.preset,
            tone=request.tone,
            date_range=request.dateRange,
            keywords=keywords
        )
        
        return response
    except ValueError as e:
        # Handle validation errors
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Log the error and return an appropriate response
        logger.error(f"Error processing request: {str(e)}")
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


from fastapi import APIRouter, HTTPException
from src.backend.schemas.request import RunFlowRequest
from src.backend.schemas.response import InsightResponse
from src.backend.mock_data.fake_insights import get_mock_insights
from src.backend.utils.logger import log_request

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

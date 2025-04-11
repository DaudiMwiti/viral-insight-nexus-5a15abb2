
import logging
from datetime import datetime
from src.backend.schemas.request import RunFlowRequest

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("insight-api")

def log_request(request: RunFlowRequest):
    """Log incoming request details."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    log_message = f"""
    Request received at {timestamp}:
    - Platforms: {', '.join(request.platforms)}
    - Preset: {request.preset}
    - Tone: {request.tone}
    - Date Range: {request.dateRange}
    """
    
    logger.info(log_message)

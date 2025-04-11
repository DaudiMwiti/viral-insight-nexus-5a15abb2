
from pydantic import BaseModel, Field
from typing import List, Optional

class RunFlowRequest(BaseModel):
    platforms: List[str] = Field(..., description="List of platforms to analyze")
    preset: str = Field(..., description="Agent preset to use")
    tone: str = Field(..., description="Tone for generated content")
    dateRange: str = Field(..., description="Date range for analysis")
    keywords: Optional[List[str]] = Field(None, description="Optional list of keywords to focus the analysis")

    class Config:
        json_schema_extra = {
            "example": {
                "platforms": ["x", "reddit", "linkedin"],
                "preset": "Insight Composer",
                "tone": "Viral",
                "dateRange": "2025-04-01 to 2025-04-11",
                "keywords": ["AI", "machine learning", "technology"]
            }
        }

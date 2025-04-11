
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional

class InsightItem(BaseModel):
    title: str
    date: str
    summary: str
    sentiment: str

class ChartData(BaseModel):
    sentimentTrend: List[Dict[str, Any]]
    engagement: List[Dict[str, Any]]

class PlatformData(BaseModel):
    insights: List[InsightItem]
    charts: ChartData

class SummaryData(BaseModel):
    totalPosts: int
    dominantSentiment: str
    topPlatform: str

class InsightResponse(BaseModel):
    summary: SummaryData
    platforms: Dict[str, PlatformData]

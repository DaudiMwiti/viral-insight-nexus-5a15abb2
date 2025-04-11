
from typing import List, Dict, Any
import logging
import os
from dotenv import load_dotenv
from .scraper_agent import ScraperAgent
from .analyst_agent import AnalystAgent
from .writer_agent import WriterAgent
from src.backend.schemas.response import InsightResponse
import json

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class InsightPipeline:
    """Orchestrates the flow of data through multiple agents to generate insights."""
    
    def __init__(self):
        self.scraper = ScraperAgent()
        self.analyst = AnalystAgent()
        self.writer = WriterAgent()
        self.logger = logging.getLogger(__name__)
    
    async def run(
        self, 
        platforms: List[str], 
        preset: str = "standard", 
        tone: str = "professional",
        date_range: str = None,
        keywords: List[str] = None
    ) -> InsightResponse:
        """
        Run the complete insight generation pipeline.
        
        Args:
            platforms: List of platform IDs to analyze
            preset: The content preset style
            tone: Desired tone for the insights
            date_range: Optional date range for filtering content
            keywords: Optional list of keywords to filter content
            
        Returns:
            InsightResponse object with generated insights
            
        Raises:
            ValueError: If GROQ_API_KEY is not set
            Exception: For any other error
        """
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY is required for insight generation")
        
        try:
            # Step 1: Scrape content from platforms
            self.logger.info(f"Scraping content from platforms: {platforms}")
            scraped_content = await self.scraper.scrape_platforms(platforms, keywords, date_range)
            
            # Step 2: Analyze content
            self.logger.info("Analyzing scraped content")
            analysis_results = await self.analyst.analyze_content(scraped_content, tone)
            
            # Step 3: Create formatted content
            self.logger.info(f"Creating content with tone: {tone} and preset: {preset}")
            formatted_results = await self.writer.create_content(analysis_results, tone, preset)
            
            # Step 4: Convert to InsightResponse format
            return self._format_as_insight_response(formatted_results)
        
        except Exception as e:
            self.logger.error(f"Error in insight pipeline: {str(e)}")
            raise
    
    def _format_as_insight_response(self, results: Dict[str, Any]) -> InsightResponse:
        """
        Format the results as an InsightResponse object.
        
        Args:
            results: The raw results from the insight pipeline
            
        Returns:
            InsightResponse object
        """
        try:
            # Convert the results to the InsightResponse format
            from src.backend.schemas.response import InsightResponse, SummaryData, PlatformData, ChartData, InsightItem
            
            # Format summary
            summary_data = SummaryData(
                totalPosts=results["summary"]["totalPosts"],
                dominantSentiment=results["summary"]["dominantSentiment"],
                topPlatform=results["summary"]["topPlatform"]
            )
            
            # Format platforms data
            platforms_data = {}
            for platform, data in results["platforms"].items():
                # Convert insights
                insights = []
                for insight_data in data["insights"]:
                    insight = InsightItem(
                        title=insight_data.get("title", "Untitled Insight"),
                        summary=insight_data.get("summary", ""),
                        date=insight_data.get("date", "today"),
                        sentiment=insight_data.get("sentiment", "neutral").capitalize()
                    )
                    insights.append(insight)
                
                # Convert chart data
                charts = ChartData(
                    sentimentTrend=data["charts"]["sentimentTrend"],
                    engagement=data["charts"]["engagement"]
                )
                
                # Create platform data
                platform_data = PlatformData(
                    insights=insights,
                    charts=charts
                )
                
                platforms_data[platform] = platform_data
            
            # Create and return the InsightResponse
            return InsightResponse(
                summary=summary_data,
                platforms=platforms_data
            )
            
        except Exception as e:
            self.logger.error(f"Error formatting results as InsightResponse: {str(e)}")
            raise


from typing import Dict, List, Any
import logging
import os
from dotenv import load_dotenv
from src.backend.utils.groq_handler import call_llm
import json
from datetime import datetime

# Load environment variables
load_dotenv()

class WriterAgent:
    """Agent responsible for crafting engaging content based on insights."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    async def create_content(self, analysis_results: Dict[str, Any], tone: str = "professional", preset: str = "standard") -> Dict[str, Any]:
        """
        Create engaging content based on analysis results.
        
        Args:
            analysis_results: Results from the AnalystAgent
            tone: Desired tone for content ("professional", "viral", "casual")
            preset: Content preset style ("standard", "insight_composer", etc.)
            
        Returns:
            Dictionary containing formatted content per platform
        """
        formatted_results = {}
        
        for platform, analysis in analysis_results.items():
            try:
                self.logger.info(f"Creating content for platform: {platform} with tone: {tone}")
                
                # Skip if there are no insights
                if not analysis.get("insights", []):
                    self.logger.warning(f"No insights to create content for platform: {platform}")
                    formatted_results[platform] = self._create_empty_platform_result()
                    continue
                
                # Format insights for readability
                insights = analysis.get("insights", [])
                sentiment_trend_data = self._generate_sentiment_trend(analysis.get("sentiment", "neutral"))
                engagement_data = self._generate_engagement_data()
                
                # Create platform-specific content
                platform_result = {
                    "insights": insights,
                    "charts": {
                        "sentimentTrend": sentiment_trend_data,
                        "engagement": engagement_data
                    }
                }
                
                formatted_results[platform] = platform_result
                
            except Exception as e:
                self.logger.error(f"Error creating content for {platform}: {str(e)}")
                formatted_results[platform] = self._create_empty_platform_result()
        
        # Calculate summary across all platforms
        summary = self._calculate_summary(formatted_results)
        
        return {
            "summary": summary,
            "platforms": formatted_results
        }
    
    def _create_empty_platform_result(self) -> Dict[str, Any]:
        """Create an empty result structure for a platform with no insights."""
        return {
            "insights": [],
            "charts": {
                "sentimentTrend": self._generate_sentiment_trend("neutral"),
                "engagement": self._generate_engagement_data()
            }
        }
    
    def _generate_sentiment_trend(self, overall_sentiment: str) -> List[Dict[str, Any]]:
        """
        Generate sentiment trend data based on the overall sentiment.
        In a production app, this would be derived from actual data trends.
        
        Args:
            overall_sentiment: Overall sentiment (positive/neutral/negative)
            
        Returns:
            List of sentiment data points for the chart
        """
        import random
        from datetime import datetime, timedelta
        
        today = datetime.now()
        sentiment_data = []
        
        # Adjust sentiment weights based on overall sentiment
        sentiment_weights = {
            "positive": {"positive": 50, "neutral": 30, "negative": 20},
            "neutral": {"positive": 33, "neutral": 34, "negative": 33},
            "negative": {"positive": 20, "neutral": 30, "negative": 50}
        }.get(overall_sentiment, {"positive": 33, "neutral": 34, "negative": 33})
        
        # Generate 7 days of data
        for i in range(7):
            date = today - timedelta(days=i)
            date_str = date.strftime("%Y-%m-%d")
            
            # Adjust values to roughly maintain the overall sentiment ratio with some variance
            positive_base = sentiment_weights["positive"]
            neutral_base = sentiment_weights["neutral"]
            negative_base = sentiment_weights["negative"]
            
            # Add randomness while keeping the trend consistent with overall sentiment
            positive = max(min(positive_base + random.randint(-15, 15), 70), 30)
            neutral = max(min(neutral_base + random.randint(-10, 10), 40), 20)
            negative = max(min(negative_base + random.randint(-10, 10), 50), 5)
            
            sentiment_data.append({
                "date": date_str,
                "positive": positive,
                "neutral": neutral,
                "negative": negative
            })
        
        return sentiment_data
    
    def _generate_engagement_data(self) -> List[Dict[str, Any]]:
        """
        Generate engagement data for charts.
        In a production app, this would be derived from actual engagement metrics.
        
        Returns:
            List of engagement data points for the chart
        """
        import random
        from datetime import datetime, timedelta
        
        today = datetime.now()
        engagement_data = []
        
        # Generate 7 days of data
        for i in range(7):
            date = today - timedelta(days=i)
            date_str = date.strftime("%Y-%m-%d")
            
            # Random engagement value between 100 and 500
            value = random.randint(100, 500)
            
            engagement_data.append({
                "date": date_str,
                "value": value
            })
        
        return engagement_data
    
    def _calculate_summary(self, platform_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate summary statistics from all platform data.
        
        Args:
            platform_results: Results for all platforms
            
        Returns:
            Summary dictionary
        """
        total_posts = 0
        sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
        platform_insight_counts = {}
        
        # Process each platform
        for platform, data in platform_results.items():
            platform_insights = data.get("insights", [])
            total_posts += len(platform_insights)
            platform_insight_counts[platform] = len(platform_insights)
            
            # Count sentiments
            for insight in platform_insights:
                sentiment = insight.get("sentiment", "neutral").capitalize()
                sentiment_counts[sentiment] += 1
        
        # Find dominant sentiment
        dominant_sentiment = max(sentiment_counts, key=sentiment_counts.get) if sentiment_counts else "Neutral"
        
        # Find top platform
        top_platform = max(platform_insight_counts, key=platform_insight_counts.get) if platform_insight_counts else ""
        
        # Map platform ID to display name
        platform_names = {
            "x": "X (Twitter)",
            "twitter": "X (Twitter)",
            "reddit": "Reddit",
            "linkedin": "LinkedIn",
            "facebook": "Facebook",
            "instagram": "Instagram",
            "youtube": "YouTube",
            "tiktok": "TikTok",
            "web": "Web Articles"
        }
        
        top_platform_display = platform_names.get(top_platform, top_platform.title())
        
        return {
            "totalPosts": total_posts,
            "dominantSentiment": dominant_sentiment,
            "topPlatform": top_platform_display
        }

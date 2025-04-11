
from typing import List, Dict, Any
from datetime import datetime
import random
from src.backend.schemas.response import InsightResponse, SummaryData, PlatformData, ChartData, InsightItem

# Platform display names mapping
PLATFORM_NAMES = {
    "x": "X (Twitter)",
    "twitter": "X (Twitter)",
    "reddit": "Reddit",
    "linkedin": "LinkedIn",
    "facebook": "Facebook",
    "instagram": "Instagram",
    "youtube": "YouTube",
    "tiktok": "TikTok"
}

# Mock insight titles per platform
INSIGHT_TITLES = {
    "x": [
        "Engagement Spike Detected",
        "Viral Hashtag Emerging",
        "User Sentiment Shift",
        "Competitor Mention Increase"
    ],
    "reddit": [
        "Subreddit Topic Trend",
        "Community Feedback Pattern",
        "Product Discussion Thread",
        "Feature Request Cluster"
    ],
    "linkedin": [
        "Industry Conversation Shift",
        "Professional Network Growth",
        "B2B Content Performance",
        "Thought Leadership Impact"
    ],
    "facebook": [
        "Page Engagement Analysis",
        "Group Discussion Trend",
        "Demographic Shift",
        "Ad Performance Insight"
    ],
    "instagram": [
        "Visual Content Performance",
        "Story Engagement Pattern",
        "Follower Growth Insight",
        "Hashtag Strategy Analysis"
    ],
    "youtube": [
        "Video Performance Trend",
        "Comment Sentiment Pattern",
        "Subscriber Growth Insight",
        "Content Strategy Analysis"
    ],
    "tiktok": [
        "Short-form Trend Detection",
        "Audio Trend Analysis",
        "Creator Collaboration Opportunity",
        "Demographic Engagement Pattern"
    ]
}

# Mock sentiment descriptions
SENTIMENTS = ["Positive", "Neutral", "Negative"]
SENTIMENT_DESCRIPTIONS = {
    "Positive": [
        "Users are responding well to the recent update",
        "Positive mentions have increased by 15% this week",
        "Customers are praising the new features",
        "Brand sentiment has improved significantly"
    ],
    "Neutral": [
        "Mixed reactions to the latest announcement",
        "Users are discussing functionality without strong opinions",
        "Balanced feedback on product changes",
        "General discussion without significant sentiment"
    ],
    "Negative": [
        "Criticism of recent service issues",
        "Customers expressing frustration with new interface",
        "Negative comparison to competitor offerings",
        "Concerns about recent policy changes"
    ]
}

def generate_dates(date_range: str) -> List[str]:
    """Generate a list of dates based on the date range string."""
    # For simplicity, we'll generate random dates within the last week
    today = datetime.now()
    
    # Generate 7 dates, formatted as YYYY-MM-DD
    dates = []
    for i in range(7):
        date = today.replace(day=today.day - i)
        dates.append(date.strftime("%Y-%m-%d"))
    
    return dates

def generate_sentiment_trend() -> List[Dict[str, Any]]:
    """Generate mock sentiment trend data for charts."""
    dates = generate_dates("")
    trend_data = []
    
    for date in dates:
        trend_data.append({
            "date": date,
            "positive": random.randint(30, 70),
            "neutral": random.randint(20, 40),
            "negative": random.randint(5, 20)
        })
    
    return trend_data

def generate_engagement_data() -> List[Dict[str, Any]]:
    """Generate mock engagement data for charts."""
    dates = generate_dates("")
    engagement_data = []
    
    for date in dates:
        engagement_data.append({
            "date": date,
            "value": random.randint(100, 500)
        })
    
    return engagement_data

def generate_platform_insights(platform: str, tone: str) -> List[InsightItem]:
    """Generate mock insights for a specific platform."""
    dates = generate_dates("")
    platform_insights = []
    
    # Get platform-specific titles or use generic ones
    titles = INSIGHT_TITLES.get(platform, INSIGHT_TITLES["x"])
    
    # Generate 3-5 insights per platform
    num_insights = random.randint(3, 5)
    for i in range(num_insights):
        # Randomly select title, date, and sentiment
        title = random.choice(titles)
        date = random.choice(dates)
        sentiment = random.choice(SENTIMENTS)
        summary = random.choice(SENTIMENT_DESCRIPTIONS[sentiment])
        
        # Add tone influence to the summary based on tone parameter
        if tone.lower() == "professional":
            summary = f"Analysis indicates that {summary.lower()}"
        elif tone.lower() == "viral":
            summary = f"Breaking insight: {summary}! This trend is gaining traction rapidly."
        elif tone.lower() == "casual":
            summary = f"Heads up! {summary}"
        
        platform_insights.append(InsightItem(
            title=title,
            date=date,
            summary=summary,
            sentiment=sentiment
        ))
    
    return platform_insights

def calculate_summary(platforms_data: Dict[str, PlatformData]) -> SummaryData:
    """Calculate summary statistics from platform data."""
    total_posts = sum(len(data.insights) for data in platforms_data.values())
    
    # Count sentiments
    sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
    for platform, data in platforms_data.items():
        for insight in data.insights:
            sentiment_counts[insight.sentiment] += 1
    
    # Find dominant sentiment
    dominant_sentiment = max(sentiment_counts, key=sentiment_counts.get)
    
    # Find top platform by insight count
    top_platform = max(
        platforms_data.keys(),
        key=lambda p: len(platforms_data[p].insights)
    )
    top_platform = PLATFORM_NAMES.get(top_platform, top_platform)
    
    return SummaryData(
        totalPosts=total_posts,
        dominantSentiment=dominant_sentiment,
        topPlatform=top_platform
    )

def get_mock_insights(platforms: List[str], preset: str, tone: str, date_range: str) -> InsightResponse:
    """Generate mock insights based on request parameters."""
    platforms_data = {}
    
    for platform in platforms:
        # Generate insights for each platform
        insights = generate_platform_insights(platform, tone)
        
        # Generate chart data
        charts = ChartData(
            sentimentTrend=generate_sentiment_trend(),
            engagement=generate_engagement_data()
        )
        
        # Create platform data
        platforms_data[platform] = PlatformData(
            insights=insights,
            charts=charts
        )
    
    # Calculate summary
    summary = calculate_summary(platforms_data)
    
    # Create response
    return InsightResponse(
        summary=summary,
        platforms=platforms_data
    )


from typing import Dict, List, Any
import logging
import os
from dotenv import load_dotenv
from src.backend.utils.groq_handler import call_llm

# Load environment variables
load_dotenv()

class AnalystAgent:
    """Agent responsible for analyzing scraped content and generating insights."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    async def analyze_content(self, platform_data: Dict[str, List[Dict[str, Any]]], tone: str = "professional") -> Dict[str, Any]:
        """
        Analyze scraped content and generate insights.
        
        Args:
            platform_data: Dictionary mapping platform IDs to lists of content items
            tone: Desired tone for analysis ("professional", "viral", "casual", etc.)
            
        Returns:
            Dictionary containing analysis results and insights
        """
        analysis_results = {}
        
        for platform, content_items in platform_data.items():
            if not content_items:
                self.logger.warning(f"No content to analyze for platform: {platform}")
                analysis_results[platform] = {
                    "insights": [],
                    "sentiment": "neutral",
                    "key_themes": [],
                    "engagement_indicators": []
                }
                continue
            
            try:
                combined_text = self._prepare_content_for_analysis(content_items)
                analysis = await self._analyze_with_llm(platform, combined_text, tone)
                
                analysis_results[platform] = analysis
            except Exception as e:
                self.logger.error(f"Error analyzing content for {platform}: {str(e)}")
                analysis_results[platform] = {
                    "insights": [{
                        "title": f"Error Analyzing {platform.title()} Content",
                        "summary": f"An error occurred while analyzing content: {str(e)}",
                        "sentiment": "neutral",
                        "date": "today"
                    }],
                    "sentiment": "neutral",
                    "key_themes": [],
                    "engagement_indicators": []
                }
        
        return analysis_results
    
    def _prepare_content_for_analysis(self, content_items: List[Dict[str, Any]]) -> str:
        """
        Prepare content items for analysis by combining them into a structured text format.
        
        Args:
            content_items: List of content items from a specific platform
            
        Returns:
            Formatted string containing all content for analysis
        """
        formatted_text = "CONTENT FOR ANALYSIS:\n\n"
        
        for i, item in enumerate(content_items, 1):
            formatted_text += f"ITEM {i}:\n"
            
            # Add title if available
            if "title" in item:
                formatted_text += f"Title: {item['title']}\n"
                
            # Add author if available
            if "author" in item:
                formatted_text += f"Author: {item['author']}\n"
                
            # Add content
            content = item.get("content", "")
            formatted_text += f"Content: {content}\n"
            
            # Add other metadata
            if "url" in item:
                formatted_text += f"URL: {item['url']}\n"
            if "score" in item:
                formatted_text += f"Score/Engagement: {item['score']}\n"
            if "date" in item:
                formatted_text += f"Date: {item['date']}\n"
                
            formatted_text += "\n---\n\n"
        
        return formatted_text
    
    async def _analyze_with_llm(self, platform: str, content: str, tone: str) -> Dict[str, Any]:
        """
        Use LLM to analyze content and generate insights.
        
        Args:
            platform: Platform ID
            content: Formatted content text
            tone: Desired tone for analysis
            
        Returns:
            Dictionary containing analysis results and insights
        """
        # Skip actual LLM call if API key is not set
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key:
            self.logger.error("GROQ_API_KEY not found in environment variables.")
            raise ValueError("GROQ_API_KEY is required for content analysis")
        
        prompt = self._create_analysis_prompt(platform, content, tone)
        
        try:
            self.logger.info(f"Calling LLM to analyze content for {platform}")
            response = await call_llm(prompt, temperature=0.3)
            
            # Parse the response
            return self._parse_llm_response(response, platform)
        except Exception as e:
            self.logger.error(f"Error calling LLM for {platform} analysis: {str(e)}")
            raise
    
    def _create_analysis_prompt(self, platform: str, content: str, tone: str) -> str:
        """
        Create a prompt for the LLM to analyze content.
        
        Args:
            platform: Platform ID
            content: Formatted content text
            tone: Desired tone for analysis
            
        Returns:
            Formatted prompt string
        """
        platform_display = platform.title()
        
        prompt = f"""
You are an expert social media analyst specializing in {platform_display} content.
Analyze the following {platform_display} content and generate insights in a {tone} tone.

{content}

Analyze this content and provide:
1. A JSON object with the following structure:
{{
  "insights": [
    {{
      "title": "Insightful title about a specific finding",
      "summary": "2-3 sentence explanation in a {tone} tone",
      "sentiment": "positive/neutral/negative",
      "date": "today"
    }},
    // 3-5 insights total
  ],
  "sentiment": "overall sentiment (positive/neutral/negative)",
  "key_themes": ["theme1", "theme2", "theme3"],
  "engagement_indicators": ["indicator1", "indicator2"]
}}

Make sure the insights are specific, data-driven, and actionable. The tone should be {tone}.
IMPORTANT: Return ONLY the JSON object with no additional text.
"""
        
        return prompt
    
    def _parse_llm_response(self, response: str, platform: str) -> Dict[str, Any]:
        """
        Parse the LLM response into structured data.
        
        Args:
            response: LLM response text
            platform: Platform ID
            
        Returns:
            Dictionary containing parsed analysis results
        """
        # Clean up response to extract just the JSON portion
        try:
            # Try to extract JSON from the response by finding the first { and last }
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response[json_start:json_end]
                import json
                analysis_data = json.loads(json_str)
                
                # Validate and ensure required fields
                if "insights" not in analysis_data:
                    analysis_data["insights"] = []
                if "sentiment" not in analysis_data:
                    analysis_data["sentiment"] = "neutral"
                if "key_themes" not in analysis_data:
                    analysis_data["key_themes"] = []
                if "engagement_indicators" not in analysis_data:
                    analysis_data["engagement_indicators"] = []
                
                return analysis_data
            else:
                raise ValueError("Could not extract JSON from LLM response")
        except Exception as e:
            self.logger.error(f"Error parsing LLM response: {str(e)}")
            self.logger.debug(f"Raw response: {response}")
            
            # Return a fallback structure
            return {
                "insights": [{
                    "title": f"{platform.title()} Content Analysis",
                    "summary": "The content was analyzed but the results could not be properly structured.",
                    "sentiment": "neutral",
                    "date": "today"
                }],
                "sentiment": "neutral",
                "key_themes": [],
                "engagement_indicators": []
            }

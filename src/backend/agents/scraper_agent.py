
import requests
from bs4 import BeautifulSoup
import re
import os
import json
from typing import List, Dict, Any
import logging

class ScraperAgent:
    """Agent responsible for scraping content from various platforms."""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    async def scrape_platforms(self, platforms: List[str], keywords: List[str] = None, date_range: str = None) -> Dict[str, List[Dict[str, Any]]]:
        """
        Scrape content from multiple platforms.
        
        Args:
            platforms: List of platform IDs to scrape
            keywords: Optional list of keywords to filter content
            date_range: Optional date range for filtering content
            
        Returns:
            Dictionary mapping platform IDs to lists of content items
        """
        results = {}
        keywords = keywords or ["technology", "ai", "data"]
        
        for platform in platforms:
            self.logger.info(f"Scraping platform: {platform}")
            try:
                if platform in ["twitter", "x"]:
                    results[platform] = await self._scrape_twitter(keywords, date_range)
                elif platform == "reddit":
                    results[platform] = await self._scrape_reddit(keywords, date_range)
                elif platform == "linkedin":
                    results[platform] = await self._scrape_linkedin(keywords, date_range)
                elif platform == "instagram":
                    results[platform] = await self._scrape_instagram(keywords, date_range)
                elif platform == "youtube":
                    results[platform] = await self._scrape_youtube(keywords, date_range)
                elif platform == "web":
                    results[platform] = await self._scrape_web_articles(keywords, date_range)
                else:
                    self.logger.warning(f"Unsupported platform: {platform}")
                    results[platform] = []
            except Exception as e:
                self.logger.error(f"Error scraping {platform}: {str(e)}")
                results[platform] = []
                
        return results
    
    async def _scrape_twitter(self, keywords: List[str], date_range: str = None) -> List[Dict[str, Any]]:
        """Scrape Twitter/X content."""
        self.logger.info(f"Scraping Twitter for keywords: {keywords}")
        
        # Since Twitter API requires authentication and may be restricted,
        # we'll use a basic web scraping approach or placeholder data
        
        # This is a simplified approach - in production, you would use Twitter API
        # or a specialized scraping tool with proper authentication
        
        sample_content = []
        for keyword in keywords:
            # For demo purposes - in production replace with real API calls
            search_url = f"https://nitter.net/search?f=tweets&q={keyword}"
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                response = requests.get(search_url, headers=headers)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    tweet_elements = soup.select('.timeline-item')[:5]  # Limit to 5 tweets
                    
                    for tweet in tweet_elements:
                        content_element = tweet.select_one('.tweet-content')
                        username_element = tweet.select_one('.username')
                        date_element = tweet.select_one('.tweet-date')
                        
                        if content_element and username_element:
                            content = content_element.get_text().strip()
                            username = username_element.get_text().strip()
                            date = date_element.get_text().strip() if date_element else "Unknown date"
                            
                            sample_content.append({
                                "platform": "twitter",
                                "author": username,
                                "content": content,
                                "date": date,
                                "keyword": keyword
                            })
            except Exception as e:
                self.logger.error(f"Error scraping Twitter for keyword {keyword}: {str(e)}")
        
        # If no content was scraped, return some basic information
        if not sample_content:
            self.logger.warning("No Twitter content scraped, using fallback approach")
            for keyword in keywords:
                sample_content.append({
                    "platform": "twitter",
                    "author": "user",
                    "content": f"Found discussions about {keyword} on social media platforms.",
                    "date": "recent",
                    "keyword": keyword,
                    "source": "web",
                    "is_fallback": True
                })
        
        return sample_content
    
    async def _scrape_reddit(self, keywords: List[str], date_range: str = None) -> List[Dict[str, Any]]:
        """Scrape Reddit content."""
        self.logger.info(f"Scraping Reddit for keywords: {keywords}")
        
        sample_content = []
        for keyword in keywords:
            # Use Reddit JSON API (which doesn't require authentication for basic searches)
            search_url = f"https://www.reddit.com/search.json?q={keyword}&sort=relevance&limit=5"
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                response = requests.get(search_url, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    posts = data.get('data', {}).get('children', [])
                    
                    for post in posts:
                        post_data = post.get('data', {})
                        sample_content.append({
                            "platform": "reddit",
                            "subreddit": post_data.get('subreddit', 'unknown'),
                            "title": post_data.get('title', ''),
                            "content": post_data.get('selftext', '')[:500],  # Limit content length
                            "author": post_data.get('author', 'unknown'),
                            "url": f"https://www.reddit.com{post_data.get('permalink', '')}",
                            "score": post_data.get('score', 0),
                            "keyword": keyword
                        })
            except Exception as e:
                self.logger.error(f"Error scraping Reddit for keyword {keyword}: {str(e)}")
        
        # Fallback content if nothing was scraped
        if not sample_content:
            for keyword in keywords:
                sample_content.append({
                    "platform": "reddit",
                    "subreddit": f"r/{keyword}",
                    "title": f"Discussions about {keyword}",
                    "content": f"Various threads discussing {keyword} and related topics.",
                    "author": "redditor",
                    "url": f"https://www.reddit.com/search?q={keyword}",
                    "score": 100,
                    "keyword": keyword,
                    "is_fallback": True
                })
        
        return sample_content
    
    async def _scrape_web_articles(self, keywords: List[str], date_range: str = None) -> List[Dict[str, Any]]:
        """Scrape general web articles related to keywords."""
        self.logger.info(f"Scraping web articles for keywords: {keywords}")
        
        sample_content = []
        
        # We'll use a simple approach to scrape some news sites
        # For demo purposes - in production you might want to use a service like NewsAPI
        news_sources = [
            "https://techcrunch.com/",
            "https://www.theverge.com/",
            "https://www.wired.com/"
        ]
        
        for source in news_sources:
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                response = requests.get(source, headers=headers)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Extract article links - this will vary by site structure
                    articles = soup.find_all('a', href=True)
                    article_links = [a['href'] for a in articles if self._is_article_link(a['href'], source)]
                    
                    # Limit to 3 articles per source
                    for link in article_links[:3]:
                        # Normalize URL if it's relative
                        if not link.startswith('http'):
                            if link.startswith('/'):
                                link = source.rstrip('/') + link
                            else:
                                link = source.rstrip('/') + '/' + link
                        
                        try:
                            article_response = requests.get(link, headers=headers)
                            if article_response.status_code == 200:
                                article_soup = BeautifulSoup(article_response.text, 'html.parser')
                                
                                # Extract title - common patterns
                                title = article_soup.find('h1')
                                title_text = title.get_text().strip() if title else "Untitled Article"
                                
                                # Extract content - this is simplified and will vary by site
                                paragraphs = article_soup.find_all('p')
                                content = " ".join([p.get_text().strip() for p in paragraphs[:5]])
                                
                                # Only include if the content matches any of our keywords
                                if any(keyword.lower() in (title_text + " " + content).lower() for keyword in keywords):
                                    sample_content.append({
                                        "platform": "web",
                                        "source": source,
                                        "title": title_text,
                                        "content": content[:1000],  # Limit content length
                                        "url": link,
                                        "matched_keywords": [k for k in keywords if k.lower() in (title_text + " " + content).lower()]
                                    })
                        except Exception as e:
                            self.logger.error(f"Error processing article {link}: {str(e)}")
            except Exception as e:
                self.logger.error(f"Error scraping source {source}: {str(e)}")
        
        # Fallback content if nothing was scraped
        if not sample_content:
            for keyword in keywords:
                sample_content.append({
                    "platform": "web",
                    "source": "web articles",
                    "title": f"Articles about {keyword}",
                    "content": f"Various online publications discussing {keyword} and related trends.",
                    "url": f"https://www.google.com/search?q={keyword}+news",
                    "matched_keywords": [keyword],
                    "is_fallback": True
                })
        
        return sample_content
    
    def _is_article_link(self, href: str, source: str) -> bool:
        """
        Determine if a link is likely an article based on URL patterns.
        This will vary by news site structure.
        """
        if not href or href.startswith('#') or href.startswith('javascript:'):
            return False
            
        # Common article URL patterns
        if re.search(r'/\d{4}/\d{2}/\d{2}/', href):  # Date pattern
            return True
        if re.search(r'/article/', href):
            return True
        if re.search(r'/news/', href):
            return True
        if re.search(r'/posts/', href):
            return True
            
        return False
    
    # Implement other platform scrapers with similar patterns
    async def _scrape_linkedin(self, keywords: List[str], date_range: str = None) -> List[Dict[str, Any]]:
        """
        LinkedIn scraping is complex due to authentication requirements.
        This is a simplified approach - in production, you would use LinkedIn API 
        with proper authentication.
        """
        # Simplified fallback approach
        sample_content = []
        for keyword in keywords:
            sample_content.append({
                "platform": "linkedin",
                "author": "professional",
                "title": f"Industry insights on {keyword}",
                "content": f"Professional discussions around {keyword} and its impact on the industry.",
                "keyword": keyword,
                "is_fallback": True
            })
        return sample_content
    
    async def _scrape_instagram(self, keywords: List[str], date_range: str = None) -> List[Dict[str, Any]]:
        """
        Instagram scraping is challenging due to API restrictions.
        This is a simplified approach.
        """
        # Simplified fallback approach
        sample_content = []
        for keyword in keywords:
            sample_content.append({
                "platform": "instagram",
                "author": "creator",
                "title": f"Visual content about {keyword}",
                "content": f"Popular visual posts related to {keyword} trending on Instagram.",
                "hashtags": [f"#{keyword}", "#trending"],
                "keyword": keyword,
                "is_fallback": True
            })
        return sample_content
    
    async def _scrape_youtube(self, keywords: List[str], date_range: str = None) -> List[Dict[str, Any]]:
        """
        YouTube scraping would ideally use their API.
        This is a simplified approach for demo purposes.
        """
        # Simplified fallback approach
        sample_content = []
        for keyword in keywords:
            sample_content.append({
                "platform": "youtube",
                "author": "creator",
                "title": f"Video content about {keyword}",
                "content": f"Popular video discussions about {keyword} on YouTube.",
                "url": f"https://www.youtube.com/results?search_query={keyword}",
                "keyword": keyword,
                "is_fallback": True
            })
        return sample_content

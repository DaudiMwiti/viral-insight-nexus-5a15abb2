
import os
import logging
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

async def call_llm(
    prompt: str, 
    temperature: float = 0.7, 
    max_tokens: int = 1000,
    model: str = "llama3-8b-8192"
) -> str:
    """
    Call the LLM with the given prompt.
    
    Args:
        prompt: The prompt to send to the LLM
        temperature: Controls randomness. Higher values mean more random completions.
        max_tokens: Maximum number of tokens in the response
        model: The LLM model to use
        
    Returns:
        The LLM's response text
        
    Raises:
        ValueError: If GROQ_API_KEY is not set
        Exception: For any other error
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    if not groq_api_key:
        logger.error("GROQ_API_KEY not found in environment variables.")
        raise ValueError("GROQ_API_KEY is required for LLM calls")
    
    try:
        # Import here to avoid errors if the package is not installed
        from langchain_groq import ChatGroq
        from langchain_core.messages import HumanMessage, SystemMessage
        
        # Initialize the model
        chat_model = ChatGroq(
            api_key=groq_api_key,
            model_name=model
        )
        
        messages = [
            SystemMessage(content="You are a helpful AI assistant that provides accurate, concise, and well-structured responses."),
            HumanMessage(content=prompt)
        ]
        
        # Call the model
        response = chat_model.invoke(messages)
        
        # Extract the response content
        if hasattr(response, 'content'):
            return response.content
        else:
            logger.warning("Unexpected response format")
            return str(response)
            
    except ImportError:
        logger.error("Failed to import langchain_groq. Make sure it's installed.")
        raise ValueError("Required package 'langchain_groq' is not installed")
    except Exception as e:
        logger.error(f"Error calling LLM: {str(e)}")
        
        # Try fallback model if specified model fails
        if model != "llama3-70b-8192":
            logger.info("Trying fallback model")
            try:
                return await call_llm(prompt, temperature, max_tokens, "llama3-70b-8192")
            except Exception as fallback_error:
                logger.error(f"Fallback model also failed: {str(fallback_error)}")
                raise fallback_error
        raise


# Backend Implementation Plan

This file contains the plan for the FastAPI backend implementation that will integrate with CrewAI agents.

## API Routes

```python
@app.post("/run-flow")
async def run_flow(params: InsightParams):
    """
    Run the CrewAI flow for generating insights.
    
    Parameters:
    - platform: The platform to scrape data from (e.g., "twitter", "reddit")
    - preset: The agent preset to use (e.g., "analyst", "writer", "composer")
    - tone: The tone for the output content (e.g., "professional", "viral")
    - date_range: The date range for data collection
    
    Returns:
    - A JSON response with insights, thread output, chart data, and raw data
    """
    # 1. Create agents based on the preset
    # 2. Configure CrewAI flow
    # 3. Execute the flow
    # 4. Return results
```

## Data Models

```python
class InsightParams(BaseModel):
    platform: str
    preset: str
    tone: str
    date: str

class Insight(BaseModel):
    id: str
    title: str
    description: str
    sentiment: str
    timestamp: str

class Thread(BaseModel):
    id: str
    title: str
    content: List[str]
    sentiment: str
    platform: str

class ChartData(BaseModel):
    sentiment: Optional[List[Dict[str, Any]]]
    engagement: Optional[List[Dict[str, Any]]]

class InsightResponse(BaseModel):
    insights: List[Insight]
    thread_output: List[Thread]
    chart_data: ChartData
    raw_data: Dict[str, Any]
```

## CrewAI Integration

```python
from crewai import Agent, Task, Crew, Process

def create_agents(params):
    """Create agents based on the provided parameters."""
    # Scraper Agent
    scraper = Agent(
        role="Web Scraper",
        goal="Extract latest data from the specified platform",
        backstory="Expert in retrieving data from various online platforms",
        tools=[scraping_tool],
        verbose=True,
        llm=get_llm_model(),
    )
    
    # Analyst Agent
    analyst = Agent(
        role="Data Analyst",
        goal=f"Analyze data and extract insights with a {params.tone} tone",
        backstory="Expert in identifying patterns and insights from social media data",
        tools=[],
        verbose=True,
        llm=get_llm_model(),
    )
    
    # Writer Agent
    writer = Agent(
        role="Content Writer",
        goal=f"Create engaging content with a {params.tone} tone",
        backstory="Expert in crafting viral social media content",
        tools=[],
        verbose=True,
        llm=get_llm_model(),
    )
    
    return {
        "scraper": scraper,
        "analyst": analyst,
        "writer": writer
    }

def create_tasks(agents, params):
    """Create tasks for the CrewAI flow."""
    scraping_task = Task(
        description=f"Scrape the latest data from {params.platform} about trending topics",
        agent=agents["scraper"],
    )
    
    analysis_task = Task(
        description="Analyze the scraped data to identify insights, trends, and sentiment",
        agent=agents["analyst"],
    )
    
    writing_task = Task(
        description=f"Create a viral thread or report with a {params.tone} tone based on the insights",
        agent=agents["writer"],
    )
    
    return [scraping_task, analysis_task, writing_task]

def get_llm_model():
    """Get the LLM model with fallback logic."""
    try:
        from langchain_groq import ChatGroq
        
        # Primary model
        primary_model = ChatGroq(
            groq_api_key=os.environ.get("GROQ_API_KEY"),
            model_name="meta-llama/llama-4-scout-17b-16e-instruct",
        )
        return primary_model
    except Exception as e:
        print(f"Error initializing primary model: {e}")
        try:
            # Fallback model
            fallback_model = ChatGroq(
                groq_api_key=os.environ.get("GROQ_API_KEY"),
                model_name="llama-3.3-70b-versatile",
            )
            return fallback_model
        except Exception as e:
            print(f"Error initializing fallback model: {e}")
            raise ValueError("Failed to initialize LLM models")

async def run_crew_process(params):
    """Run the CrewAI process with the specified parameters."""
    agents = create_agents(params)
    tasks = create_tasks(agents, params)
    
    crew = Crew(
        agents=list(agents.values()),
        tasks=tasks,
        verbose=2,
        process=Process.sequential,
    )
    
    result = crew.kickoff()
    return process_result(result, params)
```

## Model Integration

```python
# Import Groq client from the langchain package
from langchain_groq import ChatGroq

def initialize_model():
    """Initialize the model with fallback logic."""
    try:
        # Primary model
        primary_model = ChatGroq(
            groq_api_key=os.environ.get("GROQ_API_KEY"),
            model_name="meta-llama/llama-4-scout-17b-16e-instruct",
        )
        return primary_model
    except Exception as e:
        print(f"Error initializing primary model: {e}")
        try:
            # Fallback model
            fallback_model = ChatGroq(
                groq_api_key=os.environ.get("GROQ_API_KEY"),
                model_name="llama-3.3-70b-versatile",
            )
            return fallback_model
        except Exception as e:
            print(f"Error initializing fallback model: {e}")
            raise ValueError("Failed to initialize LLM models")
```

## App Setup

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Viral Insight Nexus API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you should set this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Main API route
@app.post("/run-flow")
async def run_flow(params: InsightParams):
    return await run_crew_process(params)
```

## Setup Instructions

1. Install dependencies:
```
pip install fastapi uvicorn crewai langchain-groq pydantic
```

2. Set environment variables:
```
export GROQ_API_KEY=your_groq_api_key
```

3. Run the FastAPI server:
```
uvicorn main:app --reload --port 8000
```

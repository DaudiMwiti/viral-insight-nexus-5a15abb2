
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.backend.routes import insight_routes

# Create FastAPI app
app = FastAPI(
    title="Insight Dashboard API",
    description="API for the AI-powered insight dashboard",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(insight_routes.router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Insight Dashboard API"}

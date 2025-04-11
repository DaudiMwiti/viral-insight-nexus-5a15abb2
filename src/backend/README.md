
# Insight Dashboard Backend

This is a simple FastAPI backend that serves mock data for the Insight Dashboard application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn src.backend.main:app --reload
```

The server will be available at http://localhost:8000.

## API Documentation

Once the server is running, you can access the automatic API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### POST /run-flow

Run an insight flow analysis based on selected platforms, preset, tone, and date range.

Example request:
```json
{
  "platforms": ["x", "reddit", "linkedin"],
  "preset": "Insight Composer",
  "tone": "Viral",
  "dateRange": "2025-04-01 to 2025-04-11"
}
```

## Future Extensions

This backend is designed to be extended with:
1. Real social media data integration
2. CrewAI agent integration
3. Groq/OpenAI model integration
4. Database persistence


# Installation Guide for Backend Dependencies

## Prerequisites
- Python 3.9 or newer
- pip (Python package manager)

## Installation Steps

### 1. Create a virtual environment (recommended)
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

If you encounter an error with crewai installation, try these alternative approaches:

#### Option A: Install with pip directly
```bash
pip install fastapi uvicorn pydantic python-dotenv crewai langchain langchain-groq
```

#### Option B: Install crewai with its GitHub repository
```bash
pip install git+https://github.com/joaomdmoura/crewAI.git
```

### 3. Set up environment variables
Create a `.env` file in the `src/backend` directory with the following:
```
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the server
```bash
uvicorn src.backend.main:app --reload --port 8000
```

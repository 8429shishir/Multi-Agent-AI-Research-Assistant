from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Add current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pipeline import run_research_pipeline

app = FastAPI(title="Multi-Agent AI Research API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

class ResearchResponse(BaseModel):
    topic: str
    search_results: str
    scraped_content: str
    report: str
    feedback: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Multi-Agent AI Research API is running"}

@app.post("/api/research", response_model=ResearchResponse)
async def create_research(request: ResearchRequest):
    try:
        # Note: run_research_pipeline is currently blocking.
        # For production with many users, we should use Celery or Async LangChain.
        # For now, it will run synchronously in the FastAPI worker.
        state = run_research_pipeline(request.topic)
        
        return {
            "topic": request.topic,
            "search_results": state.get("search_results", ""),
            "scraped_content": state.get("scraped_content", ""),
            "report": state.get("report", ""),
            "feedback": state.get("feedback", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api import auth, profile, skills, careers, courses, roadmap, algorithms, jobs, progress, ml

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database schema and ML services
    init_db()
    yield
    # Shutdown logic if any

app = FastAPI(
    title=settings.APP_NAME,
    description="CareerPath AI: Intelligent Career Recommendation & Skill-Path Optimization Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All API Routers under /api/v1
api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(profile.router, prefix=api_prefix)
app.include_router(skills.router, prefix=api_prefix)
app.include_router(careers.router, prefix=api_prefix)
app.include_router(courses.router, prefix=api_prefix)
app.include_router(roadmap.router, prefix=api_prefix)
app.include_router(algorithms.router, prefix=api_prefix)
app.include_router(jobs.router, prefix=api_prefix)
app.include_router(progress.router, prefix=api_prefix)
app.include_router(ml.router, prefix=api_prefix)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "status": "Online",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "demo_mode": settings.CAREERPATH_DEMO_MODE}

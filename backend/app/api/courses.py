from fastapi import APIRouter, Depends, Query, Response
from typing import Optional, List
from app.services.recommendation_service import recommendation_service
from app.core.cache import cached

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("")
def list_courses(
    response: Response,
    difficulty: Optional[str] = None,
    skill: Optional[str] = None,
    max_price: Optional[float] = None
):
    response.headers["Cache-Control"] = "public, max-age=300"
    courses = recommendation_service.verified_courses
    filtered = courses

    if difficulty:
        filtered = [c for c in filtered if c["difficulty"].lower() == difficulty.lower()]
    if skill:
        filtered = [c for c in filtered if any(skill.lower() in s.lower() for s in c["skills_covered"])]
    if max_price is not None:
        filtered = [c for c in filtered if c["cost"] <= max_price]

    return filtered

@router.get("/recommendations")
def get_recommended_courses(
    response: Response,
    missing_skills: str = Query("machine_learning,sql,docker")
):
    response.headers["Cache-Control"] = "public, max-age=300"
    skills_list = [s.strip() for s in missing_skills.split(",") if s.strip()]
    return recommendation_service.recommend_courses_for_gaps(skills_list)

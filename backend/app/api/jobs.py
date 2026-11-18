from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import StudentSkill, StudentProfile
from app.services.job_matching_service import job_matching_service

router = APIRouter(prefix="/jobs", tags=["Job Opportunities"])

@router.get("")
@router.get("/")
@router.get("/recommendations")
def get_job_recommendations(
    response: Response,
    min_match: float = 50.0,
    title_search: str = None,
    location: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    response.headers["Cache-Control"] = "private, max-age=180"
    user_id = int(current_user["sub"])
    records = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    user_skills = {}
    if records:
        for r in records:
            if r.skill:
                user_skills[r.skill.skill_name.lower().replace(" ", "_")] = r.proficiency
    else:
        user_skills = {"python": 4.0, "sql": 3.0, "machine_learning": 3.0, "data_analysis": 3.0}

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    interests = []
    if profile and profile.interests:
        interests = [i.strip() for i in profile.interests.split(",") if i.strip()]

    matched_jobs = job_matching_service.match_jobs(user_skills, interests)
    if min_match:
        matched_jobs = [j for j in matched_jobs if j.get("match_score", 0) >= min_match]
    if title_search:
        matched_jobs = [j for j in matched_jobs if title_search.lower() in j.get("title", "").lower() or title_search.lower() in j.get("company", "").lower()]
    if location:
        matched_jobs = [j for j in matched_jobs if location.lower() in j.get("location", "").lower()]
    return matched_jobs

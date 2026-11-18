from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import StudentSkill, StudentProfile, Recommendation, Occupation
from app.schemas.api_schemas import CareerCompareRequest
from app.services.ml_service import ml_service

router = APIRouter(prefix="/careers", tags=["Career Explorer & Recommendations"])

@router.get("/recommendations")
def get_recommendations(
    top_k: int = 5, 
    current_user: dict = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    user_id = int(current_user["sub"])
    
    # Load user skills
    records = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    user_skills = {}
    for r in records:
        if r.skill:
            user_skills[r.skill.skill_name.lower().replace(" ", "_")] = r.proficiency
    
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    education_level = 6.0
    if profile and profile.education_level:
        if "master" in profile.education_level.lower():
            education_level = 8.0
        elif "phd" in profile.education_level.lower() or "doctor" in profile.education_level.lower():
            education_level = 10.0

    user_profile = {
        "skills": user_skills if user_skills else {"python": 4.0, "sql": 3.0, "data_analysis": 3.0, "critical_thinking": 4.0},
        "knowledge": {"computers_and_electronics": 4.5, "mathematics": 3.8},
        "interests": {"investigative": 6.5, "realistic": 5.0},
        "education_level": education_level
    }

    recs = ml_service.recommend_careers(user_profile, top_k=top_k)
    return recs

@router.get("/explorer")
def explore_careers(
    search: Optional[str] = None, 
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return ml_service.get_all_occupations(search=search, limit=limit)

@router.get("/{soc_code}")
def get_career_detail(soc_code: str):
    detail = ml_service.get_occupation_by_code(soc_code)
    if not detail:
        raise HTTPException(status_code=404, detail="Occupation not found")
    return detail

@router.post("/compare")
def compare_careers(payload: CareerCompareRequest):
    results = []
    for code in payload.soc_codes:
        detail = ml_service.get_occupation_by_code(code)
        if detail:
            results.append(detail)
    return results

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import StudentProfile, User
from app.schemas.api_schemas import StudentProfileSchema, StudentProfileUpdate

router = APIRouter(prefix="/profile", tags=["Student Profile"])

@router.get("")
def get_profile(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        return {
            "education_level": "Bachelor's",
            "degree": "Computer Science",
            "specialization": "Software Engineering",
            "graduation_year": 2026,
            "experience_months": 0,
            "interests": ["Software Development", "Artificial Intelligence", "Data Science"],
            "preferred_location": "Remote"
        }
    
    interests_list = []
    if profile.interests:
        try:
            interests_list = json.loads(profile.interests)
        except Exception:
            interests_list = [i.strip() for i in profile.interests.split(",") if i.strip()]

    return {
        "education_level": profile.education_level or "Bachelor's",
        "degree": profile.degree or "Computer Science",
        "specialization": profile.specialization or "Software Engineering",
        "graduation_year": profile.graduation_year or 2026,
        "experience_months": profile.experience_months or 0,
        "interests": interests_list,
        "preferred_location": profile.preferred_location or "Remote"
    }

@router.put("")
def update_profile(data: StudentProfileUpdate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        profile = StudentProfile(user_id=user_id)
        db.add(profile)

    if data.education_level is not None:
        profile.education_level = data.education_level
    if data.degree is not None:
        profile.degree = data.degree
    if data.specialization is not None:
        profile.specialization = data.specialization
    if data.graduation_year is not None:
        profile.graduation_year = data.graduation_year
    if data.experience_months is not None:
        profile.experience_months = data.experience_months
    if data.interests is not None:
        profile.interests = json.dumps(data.interests)
    if data.preferred_location is not None:
        profile.preferred_location = data.preferred_location

    db.commit()
    db.refresh(profile)
    return {"message": "Profile updated successfully"}

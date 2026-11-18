from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import StudentSkill
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/roadmap", tags=["Learning Roadmap"])

@router.get("/generate")
def generate_roadmap(
    target_career: str = Query("Data Scientist"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = int(current_user["sub"])
    records = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    user_skills = {}
    for r in records:
        if r.skill:
            user_skills[r.skill.skill_name.lower().replace(" ", "_")] = r.proficiency

    roadmap = recommendation_service.generate_roadmap_graph(user_skills, target_career)
    return roadmap

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import StudentSkill, StudentProfile, Recommendation, LearningPlan
from app.services.ml_service import ml_service

router = APIRouter(prefix="/progress", tags=["Dashboard & Progress Tracking"])

@router.get("/dashboard-summary")
def get_dashboard_summary(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = int(current_user["sub"])
    skills_count = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).count()
    if skills_count == 0:
        skills_count = 6  # Baseline profile
        
    records = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    user_skills = {}
    for r in records:
        if r.skill:
            user_skills[r.skill.skill_name.lower().replace(" ", "_")] = r.proficiency

    recs = ml_service.recommend_careers({
        "skills": user_skills if user_skills else {"python": 4.0, "sql": 3.0, "data_analysis": 3.0, "critical_thinking": 4.0},
        "knowledge": {"computers_and_electronics": 4.0, "mathematics": 3.5},
        "interests": {"investigative": 6.0, "realistic": 5.0},
        "education_level": 6.0
    }, top_k=3)

    top_match = recs[0]["compatibility_score"] if recs else 88.5

    return {
        "user_name": current_user.get("email", "").split("@")[0].title() or "Student",
        "total_skills_assessed": skills_count,
        "career_recommendations_count": 5,
        "current_skill_match_score": top_match,
        "learning_progress_percent": 42.0,
        "saved_jobs_count": 4,
        "top_recommendations": recs,
        "next_actions": [
            {"title": "Strengthen Cloud Architecture", "category": "Skill Gap", "action_url": "/roadmap"},
            {"title": "Explore Top Match: " + (recs[0]['title'] if recs else 'Software Developer'), "category": "Career", "action_url": "/careers"},
            {"title": "Compare Dijkstra vs A* in Playground", "category": "Algorithms", "action_url": "/algorithms"},
            {"title": "Complete Practice Assessment", "category": "Assessment", "action_url": "/assessment"}
        ]
    }

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List, Any
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import Skill, StudentSkill
from app.schemas.api_schemas import AssessmentSubmitSchema, StudentSkillUpdateSchema
from app.services.ml_service import ml_service
from app.services.recommendation_service import recommendation_service

router = APIRouter(prefix="/skills", tags=["Skills Assessment"])

@router.get("")
def get_user_skills(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    records = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    
    if not records:
        # Default sample skills if not assessed yet
        return [
            {"id": 1, "skill_name": "Python", "category": "Programming", "proficiency": 4.0, "status": "Possessed"},
            {"id": 2, "skill_name": "SQL", "category": "Database", "proficiency": 3.5, "status": "Possessed"},
            {"id": 3, "skill_name": "Data Analysis", "category": "Analytics", "proficiency": 3.0, "status": "Possessed"},
            {"id": 4, "skill_name": "Machine Learning", "category": "AI/ML", "proficiency": 2.5, "status": "Learning"},
            {"id": 5, "skill_name": "React", "category": "Frontend", "proficiency": 3.5, "status": "Possessed"},
            {"id": 6, "skill_name": "Docker", "category": "DevOps", "proficiency": 2.0, "status": "Learning"}
        ]
        
    results = []
    for r in records:
        results.append({
            "id": r.id,
            "skill_name": r.skill.skill_name if r.skill else "Skill",
            "category": r.skill.category if r.skill else "Technical",
            "proficiency": r.proficiency,
            "status": r.status
        })
    return results

@router.post("/assessment")
def submit_assessment(data: AssessmentSubmitSchema, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])

    # Persist or update skills in database
    for s_name, prof in data.skills.items():
        norm_name = s_name.replace("_", " ").title()
        skill = db.query(Skill).filter(Skill.skill_name == norm_name).first()
        if not skill:
            skill = Skill(skill_name=norm_name, category="Technical")
            db.add(skill)
            db.commit()
            db.refresh(skill)

        student_skill = db.query(StudentSkill).filter(
            StudentSkill.user_id == user_id, 
            StudentSkill.skill_id == skill.id
        ).first()

        if not student_skill:
            student_skill = StudentSkill(
                user_id=user_id,
                skill_id=skill.id,
                proficiency=float(prof),
                status="Possessed" if prof >= 2.0 else "Learning"
            )
            db.add(student_skill)
        else:
            student_skill.proficiency = float(prof)
            student_skill.status = "Possessed" if prof >= 2.0 else "Learning"

    db.commit()

    # Generate immediate recommendations from assessment
    recs = ml_service.recommend_careers(data.model_dump(), top_k=5)
    return {
        "message": "Assessment submitted and analyzed successfully",
        "top_recommendations": recs
    }

@router.put("/{skill_id}")
def update_skill_proficiency(skill_id: int, update: StudentSkillUpdateSchema, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    rec = db.query(StudentSkill).filter(StudentSkill.id == skill_id, StudentSkill.user_id == user_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Skill record not found")
    
    rec.proficiency = update.proficiency
    if update.status:
        rec.status = update.status
    db.commit()
    return {"message": "Skill proficiency updated successfully"}

@router.get("/student")
def get_student_skills(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_user_skills(current_user, db)

@router.get("/gap/{soc_code}")
def get_gap_by_code(soc_code: str, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    records = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    user_skills = {}
    if records:
        for r in records:
            if r.skill:
                user_skills[r.skill.skill_name.lower().replace(" ", "_")] = r.proficiency
    else:
        user_skills = {"python": 4.0, "sql": 3.0, "data_analysis": 3.0, "critical_thinking": 4.0, "mathematics": 4.0}

    analysis = recommendation_service.analyze_skill_gaps(user_skills, soc_code)
    # Ensure frontend compatibility field names
    gaps = analysis.get("radar_data", [])
    for g in gaps:
        g["priority"] = g.get("priority", "MEDIUM").upper()
    return {
        "target_career": analysis.get("occupation_title", "Target Career"),
        "onet_soc_code": soc_code,
        "job_zone": analysis.get("job_zone", 4),
        "gaps": gaps,
        "analysis": analysis
    }

@router.post("/gap-analysis")
def get_gap_analysis(payload: Dict[str, Any], current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    soc_code = payload.get("target_soc_code", "15-1252.00")
    
    # Fetch user skills
    records = db.query(StudentSkill).filter(StudentSkill.user_id == user_id).all()
    user_skills = {}
    if records:
        for r in records:
            if r.skill:
                user_skills[r.skill.skill_name.lower().replace(" ", "_")] = r.proficiency
    else:
        # Sample baseline
        user_skills = {"python": 4.0, "sql": 3.0, "data_analysis": 2.5, "critical_thinking": 4.0}

    analysis = recommendation_service.analyze_skill_gaps(user_skills, soc_code)
    return analysis

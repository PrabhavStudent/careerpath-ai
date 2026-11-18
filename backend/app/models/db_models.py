import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    skills = relationship("StudentSkill", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")
    learning_plans = relationship("LearningPlan", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_users_email_created", "email", "created_at"),
    )

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    education_level = Column(String(80), nullable=True, index=True)
    degree = Column(String(120), nullable=True)
    specialization = Column(String(120), nullable=True)
    graduation_year = Column(Integer, nullable=True, index=True)
    experience_months = Column(Integer, default=0)
    interests = Column(Text, nullable=True)
    preferred_location = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(80), default="Technical", index=True)
    description = Column(Text, nullable=True)

    __table_args__ = (
        Index("idx_skills_name_category", "skill_name", "category"),
    )

class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    proficiency = Column(Float, default=1.0)  # 0 to 5 scale
    status = Column(String(40), default="Possessed", index=True)  # Possessed, Learning, Mastered
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill")

    __table_args__ = (
        Index("idx_student_skills_user_skill", "user_id", "skill_id"),
        Index("idx_student_skills_status", "status"),
    )

class Occupation(Base):
    __tablename__ = "occupations"

    id = Column(Integer, primary_key=True, index=True)
    onet_soc_code = Column(String(20), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    soc_major_group = Column(String(50), nullable=True, index=True)
    job_zone = Column(Integer, default=3, index=True)

    skills = relationship("OccupationSkill", back_populates="occupation", cascade="all, delete-orphan")
    knowledge = relationship("OccupationKnowledge", back_populates="occupation", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_occupations_soc_group", "soc_major_group"),
        Index("idx_occupations_job_zone", "job_zone"),
    )

class OccupationSkill(Base):
    __tablename__ = "occupation_skills"

    id = Column(Integer, primary_key=True, index=True)
    occupation_id = Column(Integer, ForeignKey("occupations.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    importance = Column(Float, default=1.0)
    original_scale = Column(String(10), default="IM")
    original_rating = Column(Float, default=1.0)

    occupation = relationship("Occupation", back_populates="skills")
    skill = relationship("Skill")

    __table_args__ = (
        Index("idx_occ_skills_occ_skill", "occupation_id", "skill_id"),
        Index("idx_occ_skills_skill_importance", "skill_id", "importance"),
    )

class OccupationKnowledge(Base):
    __tablename__ = "occupation_knowledge"

    id = Column(Integer, primary_key=True, index=True)
    occupation_id = Column(Integer, ForeignKey("occupations.id", ondelete="CASCADE"), nullable=False, index=True)
    knowledge_name = Column(String(120), nullable=False, index=True)
    importance = Column(Float, default=1.0)
    level = Column(Float, default=0.0)

    occupation = relationship("Occupation", back_populates="knowledge")

    __table_args__ = (
        Index("idx_occ_kn_occ_name", "occupation_id", "knowledge_name"),
    )

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(250), nullable=False, index=True)
    provider = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    cost = Column(Float, default=0.0, index=True)
    currency = Column(String(10), default="INR")
    duration = Column(String(50), default="4 weeks")
    course_url = Column(String(300), nullable=True)
    difficulty = Column(String(40), default="Beginner", index=True)
    rating = Column(Float, default=4.8, index=True)

    course_skills = relationship("CourseSkill", back_populates="course", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_courses_cost_diff", "cost", "difficulty"),
        Index("idx_courses_rating_cost", "rating", "cost"),
    )

class CourseSkill(Base):
    __tablename__ = "course_skills"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)

    course = relationship("Course", back_populates="course_skills")
    skill = relationship("Skill")

    __table_args__ = (
        Index("idx_course_skills_composite", "course_id", "skill_id"),
    )

class SkillPrerequisite(Base):
    __tablename__ = "skill_prerequisites"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    prerequisite_skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)

    skill = relationship("Skill", foreign_keys=[skill_id])
    prerequisite = relationship("Skill", foreign_keys=[prerequisite_skill_id])

    __table_args__ = (
        Index("idx_prereq_composite", "skill_id", "prerequisite_skill_id"),
    )

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    company = Column(String(150), nullable=False, index=True)
    location = Column(String(120), default="Remote", index=True)
    description = Column(Text, nullable=True)
    experience = Column(String(80), default="0-2 years")
    salary_min = Column(Float, default=850000.0, index=True)
    salary_max = Column(Float, default=1800000.0, index=True)
    application_url = Column(String(300), nullable=True)
    source = Column(String(80), default="Verified Direct Employer")
    posted_date = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    job_skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_jobs_comp_loc", "company", "location"),
        Index("idx_jobs_salary_range", "salary_min", "salary_max"),
        Index("idx_jobs_posted_date", "posted_date"),
    )

class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)

    job = relationship("Job", back_populates="job_skills")
    skill = relationship("Skill")

    __table_args__ = (
        Index("idx_job_skills_composite", "job_id", "skill_id"),
    )

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    occupation_id = Column(Integer, ForeignKey("occupations.id", ondelete="CASCADE"), nullable=False, index=True)
    compatibility_score = Column(Float, default=0.0, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="recommendations")
    occupation = relationship("Occupation")

    __table_args__ = (
        Index("idx_recommendations_user_score", "user_id", "compatibility_score"),
    )

class LearningPlan(Base):
    __tablename__ = "learning_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_occupation_id = Column(Integer, ForeignKey("occupations.id", ondelete="CASCADE"), nullable=False, index=True)
    total_cost = Column(Float, default=0.0)
    estimated_hours = Column(Float, default=0.0)
    status = Column(String(40), default="Active", index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="learning_plans")
    target_occupation = relationship("Occupation")
    items = relationship("LearningPlanItem", back_populates="learning_plan", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_learning_plans_user_status", "user_id", "status"),
    )

class LearningPlanItem(Base):
    __tablename__ = "learning_plan_items"

    id = Column(Integer, primary_key=True, index=True)
    learning_plan_id = Column(Integer, ForeignKey("learning_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True, index=True)
    sequence_order = Column(Integer, default=1, index=True)
    status = Column(String(40), default="Not Started")

    learning_plan = relationship("LearningPlan", back_populates="items")
    skill = relationship("Skill")
    course = relationship("Course")

    __table_args__ = (
        Index("idx_plan_items_seq", "learning_plan_id", "sequence_order"),
    )

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False, index=True)
    progress = Column(Float, default=0.0)  # 0 to 100%
    completion_date = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="progress")
    skill = relationship("Skill")

    __table_args__ = (
        Index("idx_user_progress_composite", "user_id", "skill_id"),
    )

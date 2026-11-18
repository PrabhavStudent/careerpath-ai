from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=3, max_length=150)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    created_at: Optional[datetime] = None

# --- Profile Schemas ---
class StudentProfileSchema(BaseModel):
    education_level: Optional[str] = "Bachelor's"
    degree: Optional[str] = "Computer Science"
    specialization: Optional[str] = "Software Engineering"
    graduation_year: Optional[int] = 2026
    experience_months: Optional[int] = 0
    interests: Optional[List[str]] = []
    preferred_location: Optional[str] = "Remote"

class StudentProfileUpdate(BaseModel):
    education_level: Optional[str] = None
    degree: Optional[str] = None
    specialization: Optional[str] = None
    graduation_year: Optional[int] = None
    experience_months: Optional[int] = None
    interests: Optional[List[str]] = None
    preferred_location: Optional[str] = None

# --- Skills Schemas ---
class SkillItem(BaseModel):
    skill_name: str
    proficiency: float = Field(..., ge=0.0, le=5.0)

class AssessmentSubmitSchema(BaseModel):
    education_level: Optional[str] = "Bachelor's"
    degree: Optional[str] = "Computer Science"
    specialization: Optional[str] = "Software Engineering"
    graduation_year: Optional[int] = 2026
    skills: Dict[str, float] = {}  # {skill_name: 0..5}
    knowledge: Dict[str, float] = {}  # {domain_name: 0..5}
    software: List[str] = []
    interests: Dict[str, float] = {}  # {riasec_code: 1..7}

class StudentSkillUpdateSchema(BaseModel):
    proficiency: float = Field(..., ge=0.0, le=5.0)
    status: Optional[str] = "Possessed"

# --- Career Schemas ---
class CareerRecommendationOut(BaseModel):
    onet_soc_code: str
    title: str
    compatibility_score: float
    description: Optional[str] = ""
    soc_major_group: Optional[str] = ""
    job_zone: int = 3
    breakdown: Dict[str, float] = {}
    matching_strengths: List[str] = []
    critical_skill_gaps: List[str] = []

class CareerCompareRequest(BaseModel):
    soc_codes: List[str] = Field(..., min_length=2, max_length=3)

# --- Course Schemas ---
class CourseSchema(BaseModel):
    id: int
    title: str
    provider: str
    description: Optional[str] = ""
    cost: float = 0.0
    currency: str = "USD"
    duration: str = "4 weeks"
    course_url: Optional[str] = ""
    difficulty: str = "Beginner"
    rating: float = 4.8
    skills_covered: List[str] = []

# --- Roadmap & Graph Schemas ---
class RoadmapNode(BaseModel):
    id: str
    label: str
    type: str  # 'completed', 'in_progress', 'not_started', 'target_career'
    data: Dict[str, Any] = {}
    position: Dict[str, float] = {"x": 0, "y": 0}

class RoadmapEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = ""

class RoadmapGraphResponse(BaseModel):
    target_career: str
    total_estimated_hours: float
    estimated_total_cost: float
    skills_to_learn_count: int
    prerequisites_count: int
    nodes: List[RoadmapNode]
    edges: List[RoadmapEdge]
    recommended_sequence: List[str]

# --- Search Algorithms Schemas ---
class AlgorithmRunRequest(BaseModel):
    algorithm: Optional[str] = "astar"
    target_career: Optional[str] = "Data Scientist"
    start_skill: Optional[str] = "python"
    budget: Optional[float] = 500.0  # For branch and bound
    heuristic_weight: Optional[float] = 1.0
    heuristic_type: Optional[str] = "hybrid"

class AlgorithmStepTrace(BaseModel):
    step: int
    current_node: str
    queue_or_stack: List[str]
    visited_nodes: List[str]
    action_note: str

class AlgorithmResultOut(BaseModel):
    algorithm_name: str
    discovered_path: List[str]
    path_length: int
    total_cost: float
    estimated_hours: float
    nodes_expanded: int
    execution_time_ms: float
    optimality_guarantee: str
    step_traces: List[AlgorithmStepTrace] = []

# --- Job Schemas ---
class JobSchema(BaseModel):
    id: int
    title: str
    company: str
    location: str
    description: Optional[str] = ""
    experience: str = "0-2 years"
    salary_range: str = "$60,000 - $95,000"
    match_score: float = 85.0
    matching_skills: List[str] = []
    missing_skills: List[str] = []
    application_url: Optional[str] = "#"
    posted_date: Optional[str] = "Recently"

from typing import Dict, List, Any
import numpy as np
from app.services.ml_service import ml_service

class RecommendationService:
    def __init__(self):
        self.verified_courses = [
            {"id": 1, "title": "Complete Python Masterclass", "provider": "Coursera", "skills_covered": ["Python", "Programming"], "cost": 3499.0, "currency": "INR", "duration": "6 weeks", "difficulty": "Beginner", "rating": 4.8, "course_url": "https://coursera.org"},
            {"id": 2, "title": "SQL for Data Science and Engineering", "provider": "edX", "skills_covered": ["SQL", "Database Management"], "cost": 2999.0, "currency": "INR", "duration": "4 weeks", "difficulty": "Intermediate", "rating": 4.7, "course_url": "https://edx.org"},
            {"id": 3, "title": "Applied Machine Learning with Scikit-Learn", "provider": "Udacity", "skills_covered": ["Machine Learning", "Statistics"], "cost": 5999.0, "currency": "INR", "duration": "8 weeks", "difficulty": "Advanced", "rating": 4.9, "course_url": "https://udacity.com"},
            {"id": 4, "title": "Full Stack Web Development with React and Node", "provider": "freeCodeCamp", "skills_covered": ["React", "JavaScript", "Node.js"], "cost": 0.0, "currency": "INR", "duration": "10 weeks", "difficulty": "Intermediate", "rating": 4.9, "course_url": "https://freecodecamp.org"},
            {"id": 5, "title": "Docker and Kubernetes for Cloud Native DevOps", "provider": "Pluralsight", "skills_covered": ["Docker", "Kubernetes", "DevOps"], "cost": 4499.0, "currency": "INR", "duration": "5 weeks", "difficulty": "Advanced", "rating": 4.8, "course_url": "https://pluralsight.com"},
            {"id": 6, "title": "Modern Cloud Architecture with AWS", "provider": "AWS Training", "skills_covered": ["Cloud Computing", "AWS"], "cost": 0.0, "currency": "INR", "duration": "6 weeks", "difficulty": "Intermediate", "rating": 4.8, "course_url": "https://aws.amazon.com/training/"},
            {"id": 7, "title": "Deep Learning & Neural Networks Specialization", "provider": "DeepLearning.AI", "skills_covered": ["Deep Learning", "Artificial Intelligence"], "cost": 7999.0, "currency": "INR", "duration": "12 weeks", "difficulty": "Advanced", "rating": 4.9, "course_url": "https://deeplearning.ai"}
        ]

    def analyze_skill_gaps(self, user_skills: Dict[str, float], target_soc_code: str) -> Dict[str, Any]:
        """
        Computes formal skill gaps:
        Gap = max(0, R - S)
        Weighted Gap = Importance * Gap
        Categorizes skills into: Strong, Moderate, Weak, Missing.
        """
        occ_details = ml_service.get_occupation_by_code(target_soc_code)
        if not occ_details:
            occ_details = ml_service.get_all_occupations(limit=1)[0]
            target_skills = [
                {"name": "Programming", "importance": 4.5, "level": 5.0},
                {"name": "Complex Problem Solving", "importance": 4.2, "level": 4.8},
                {"name": "Critical Thinking", "importance": 4.0, "level": 4.5},
                {"name": "Mathematics", "importance": 3.8, "level": 4.0},
                {"name": "Active Learning", "importance": 3.5, "level": 3.8}
            ]
        else:
            target_skills = occ_details.get("top_skills", [])

        radar_data = []
        strong_skills = []
        moderate_skills = []
        weak_skills = []
        missing_skills = []

        for item in target_skills:
            name = item["name"]
            req_importance = item["importance"]
            req_level = item["level"]
            
            # Map user 0-5 scale to O*NET 0-7 scale
            user_level_raw = user_skills.get(name.lower().replace(" ", "_"), 0.0)
            user_level_scaled = user_level_raw * (7.0 / 5.0)

            gap = max(0.0, req_level - user_level_scaled)
            weighted_gap = round(req_importance * gap, 2)

            point = {
                "skill": name,
                "user_level": round(user_level_raw, 1),
                "user_level_scaled": round(user_level_scaled, 1),
                "required_importance": round(req_importance, 1),
                "required_level": round(req_level, 1),
                "gap": round(gap, 1),
                "weighted_gap": weighted_gap,
                "priority": "High" if weighted_gap >= 8.0 else ("Medium" if weighted_gap >= 4.0 else "Low")
            }
            radar_data.append(point)

            if user_level_raw == 0:
                missing_skills.append(point)
            elif user_level_scaled >= req_level:
                strong_skills.append(point)
            elif user_level_scaled >= req_level * 0.6:
                moderate_skills.append(point)
            else:
                weak_skills.append(point)

        return {
            "target_occupation": occ_details.get("title", "Target Career"),
            "target_soc_code": target_soc_code,
            "radar_data": radar_data,
            "strong_skills": strong_skills,
            "moderate_skills": moderate_skills,
            "weak_skills": weak_skills,
            "missing_skills": missing_skills
        }

    def recommend_courses_for_gaps(self, missing_skills: List[str]) -> List[dict]:
        """Filters catalog courses that address the student's missing competencies."""
        recommended = []
        missing_lower = [s.lower() for s in missing_skills]

        for course in self.verified_courses:
            matches = [s for s in course["skills_covered"] if any(m in s.lower() for m in missing_lower)]
            if matches:
                item = course.copy()
                item["matched_gaps"] = matches
                recommended.append(item)

        return recommended if recommended else self.verified_courses[:4]

    def generate_roadmap_graph(self, user_skills: Dict[str, float], target_career: str = "Data Scientist") -> Dict[str, Any]:
        """
        Builds dynamic React Flow nodes & edges for the student's learning roadmap.
        """
        # Node Sequence for Career Pathways
        path_sequences = {
            "data_scientist": [
                {"id": "python", "label": "Python Programming", "hours": 40, "cost": 0.0},
                {"id": "sql", "label": "SQL & Relational Databases", "hours": 30, "cost": 50.0},
                {"id": "data_analysis", "label": "Exploratory Data Analysis", "hours": 45, "cost": 80.0},
                {"id": "statistics", "label": "Mathematical Statistics", "hours": 50, "cost": 100.0},
                {"id": "machine_learning", "label": "Machine Learning & Scikit-Learn", "hours": 60, "cost": 150.0},
                {"id": "deep_learning", "label": "Neural Networks & Deep Learning", "hours": 70, "cost": 200.0},
                {"id": "target", "label": "Career: Data Scientist", "hours": 0, "cost": 0.0}
            ],
            "software_developer": [
                {"id": "python", "label": "Core Programming (Python/Java)", "hours": 40, "cost": 0.0},
                {"id": "dsa", "label": "Data Structures & Algorithms", "hours": 60, "cost": 45.0},
                {"id": "database", "label": "Database Design & SQL", "hours": 35, "cost": 50.0},
                {"id": "backend", "label": "Backend APIs (FastAPI/Django)", "hours": 50, "cost": 75.0},
                {"id": "devops_basic", "label": "Docker & Deployment Basics", "hours": 30, "cost": 60.0},
                {"id": "target", "label": "Career: Software Developer", "hours": 0, "cost": 0.0}
            ]
        }

        key = "software_developer" if "software" in target_career.lower() else "data_scientist"
        sequence = path_sequences[key]

        nodes = []
        edges = []
        total_hours = 0.0
        total_cost = 0.0
        to_learn_count = 0

        y_offset = 60
        for idx, item in enumerate(sequence):
            is_target = (item["id"] == "target")
            user_val = user_skills.get(item["id"], 0.0)

            if is_target:
                n_type = "target_career"
            elif user_val >= 3.5:
                n_type = "completed"
            elif user_val > 0.0:
                n_type = "in_progress"
                total_hours += item["hours"] * 0.5
                total_cost += item["cost"]
                to_learn_count += 1
            else:
                n_type = "not_started"
                total_hours += item["hours"]
                total_cost += item["cost"]
                to_learn_count += 1

            nodes.append({
                "id": item["id"],
                "label": item["label"],
                "type": n_type,
                "data": {
                    "label": item["label"],
                    "hours": item["hours"],
                    "cost": item["cost"],
                    "status": n_type
                },
                "position": {"x": 260, "y": y_offset}
            })

            if idx > 0:
                prev_id = sequence[idx - 1]["id"]
                edges.append({
                    "id": f"e-{prev_id}-{item['id']}",
                    "source": prev_id,
                    "target": item["id"],
                    "label": "Prerequisite" if not is_target else "Transition"
                })

            y_offset += 110

        return {
            "target_career": target_career,
            "total_estimated_hours": total_hours,
            "estimated_total_cost": total_cost,
            "skills_to_learn_count": to_learn_count,
            "prerequisites_count": len(edges),
            "nodes": nodes,
            "edges": edges,
            "recommended_sequence": [s["label"] for s in sequence if s["id"] != "target"]
        }

recommendation_service = RecommendationService()

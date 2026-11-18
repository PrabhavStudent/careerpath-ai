from typing import Dict, List, Any
import numpy as np

class JobMatchingService:
    def __init__(self):
        self.jobs_database = [
            {
                "id": 1,
                "title": "Junior Python / Backend Engineer",
                "company": "TechStream Solutions",
                "location": "Bengaluru, India (Hybrid)",
                "experience": "0-2 years",
                "salary_range": "₹8,50,000 - ₹12,00,000 / yr",
                "description": "Building scalable REST APIs with Python, FastAPI, and PostgreSQL. Collaborative agile team with mentorship.",
                "required_skills": ["python", "sql", "git", "fastapi", "docker"],
                "application_url": "https://careers.techstream.io/job/101",
                "posted_date": "2 days ago"
            },
            {
                "id": 2,
                "title": "Associate Data Scientist",
                "company": "Quantix Analytics",
                "location": "Hyderabad, India (Hybrid)",
                "experience": "1-3 years",
                "salary_range": "₹10,50,000 - ₹15,00,000 / yr",
                "description": "Statistical modeling, exploratory data analysis, and predictive modeling using Scikit-Learn and Pandas.",
                "required_skills": ["python", "machine_learning", "statistics", "data_analysis", "sql"],
                "application_url": "https://quantix.ai/careers/204",
                "posted_date": "1 day ago"
            },
            {
                "id": 3,
                "title": "Full Stack React & Node Developer",
                "company": "Nexus Interactive",
                "location": "Pune, India (Remote)",
                "experience": "1-3 years",
                "salary_range": "₹9,00,000 - ₹14,00,000 / yr",
                "description": "Developing modern web apps with React, Tailwind CSS, Node.js, and cloud integrations.",
                "required_skills": ["react", "javascript", "html_css", "nodejs", "git"],
                "application_url": "https://nexusinteractive.com/jobs/305",
                "posted_date": "3 days ago"
            },
            {
                "id": 4,
                "title": "Cloud & DevOps Junior Specialist",
                "company": "CloudForge Systems",
                "location": "Noida, India (Remote)",
                "experience": "0-2 years",
                "salary_range": "₹8,00,000 - ₹13,00,000 / yr",
                "description": "Containerizing microservices with Docker, configuring Kubernetes clusters, and setting up automated CI/CD.",
                "required_skills": ["linux", "docker", "cloud_computing", "kubernetes", "git"],
                "application_url": "https://cloudforge.net/openings/402",
                "posted_date": "Just now"
            },
            {
                "id": 5,
                "title": "Machine Learning Engineer - NLP & Vision",
                "company": "Aether AI Labs",
                "location": "Bengaluru, India (Hybrid)",
                "experience": "2-4 years",
                "salary_range": "₹16,00,000 - ₹24,00,000 / yr",
                "salary_range": "$115,000 - $145,000",
                "description": "Training and fine-tuning transformer models, deploying inference pipelines, optimizing latency.",
                "required_skills": ["python", "deep_learning", "machine_learning", "docker", "cloud_computing"],
                "application_url": "https://aetherai.io/jobs/508",
                "posted_date": "4 days ago"
            }
        ]

    def match_jobs(self, user_skills: Dict[str, float], user_interests: List[str] = None) -> List[Dict[str, Any]]:
        """
        Calculates configurable weighted match score:
        Match Score = 0.7 * Skill Overlap + 0.3 * Domain Interest
        """
        user_skills_clean = {k.lower().replace(" ", "_"): v for k, v in user_skills.items() if v > 0}
        results = []

        for job in self.jobs_database:
            req_skills = job["required_skills"]
            matched = []
            missing = []

            for s in req_skills:
                u_score = user_skills_clean.get(s, 0.0)
                if u_score >= 2.0:
                    matched.append(s.replace("_", " ").title())
                else:
                    missing.append(s.replace("_", " ").title())

            # Skill overlap percentage
            skill_ratio = len(matched) / max(1, len(req_skills))

            # Domain interest bonus
            interest_bonus = 0.8
            if user_interests:
                title_lower = job["title"].lower()
                if any(i.lower() in title_lower for i in user_interests):
                    interest_bonus = 1.0

            total_score = round((0.7 * skill_ratio + 0.3 * interest_bonus) * 100, 1)

            results.append({
                **job,
                "match_score": min(98.5, max(45.0, total_score)),
                "matching_skills": matched,
                "missing_skills": missing
            })

        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results

job_matching_service = JobMatchingService()

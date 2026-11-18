import os
from fastapi import APIRouter
from app.services.ml_service import ml_service
from app.core.config import settings

router = APIRouter(prefix="/ml", tags=["ML Model Insights"])

@router.get("/metadata")
def get_ml_metadata():
    return ml_service.get_metadata()

@router.get("/model-comparison")
def get_model_comparison():
    """Returns official trained comparison table across evaluated model families."""
    return [
        {
            "model": "Support Vector Machine (Linear SVM)",
            "accuracy": 0.7372,
            "macro_f1": 0.6040,
            "balanced_accuracy": 0.6028,
            "top_3_accuracy": 0.8832,
            "is_best": True,
            "status": "Selected Production Classifier"
        },
        {
            "model": "Logistic Regression (L2 Regularized)",
            "accuracy": 0.7591,
            "macro_f1": 0.6290,
            "balanced_accuracy": 0.6260,
            "top_3_accuracy": 0.9051,
            "is_best": False,
            "status": "Baseline Champion"
        },
        {
            "model": "Random Forest Classifier",
            "accuracy": 0.7299,
            "macro_f1": 0.5650,
            "balanced_accuracy": 0.5510,
            "top_3_accuracy": 0.8686,
            "is_best": False,
            "status": "Ensemble Comparison"
        },
        {
            "model": "K-Nearest Neighbors (k=7)",
            "accuracy": 0.6715,
            "macro_f1": 0.5136,
            "balanced_accuracy": 0.5042,
            "top_3_accuracy": 0.8321,
            "is_best": False,
            "status": "Distance Comparison"
        },
        {
            "model": "Decision Tree Classifier",
            "accuracy": 0.5401,
            "macro_f1": 0.4324,
            "balanced_accuracy": 0.4280,
            "top_3_accuracy": 0.7007,
            "is_best": False,
            "status": "Interpretable Tree"
        },
        {
            "model": "Zero-Rule Baseline (Dummy)",
            "accuracy": 0.1168,
            "macro_f1": 0.0095,
            "balanced_accuracy": 0.0455,
            "top_3_accuracy": 0.2847,
            "is_best": False,
            "status": "Majority Class Baseline"
        }
    ]

@router.get("/feature-importance")
def get_feature_importance():
    return [
        {"feature": "knowledge_computers_and_electronics_importance", "domain": "Knowledge", "weight": 0.142},
        {"feature": "skill_programming_importance", "domain": "Skills", "weight": 0.128},
        {"feature": "ability_mathematical_reasoning_importance", "domain": "Abilities", "weight": 0.115},
        {"feature": "skill_complex_problem_solving_importance", "domain": "Skills", "weight": 0.098},
        {"feature": "knowledge_mathematics_importance", "domain": "Knowledge", "weight": 0.091},
        {"feature": "work_activity_interacting_with_computers_level", "domain": "Work Activities", "weight": 0.084},
        {"feature": "ability_deductive_reasoning_level", "domain": "Abilities", "weight": 0.076},
        {"feature": "interest_investigative", "domain": "Interests", "weight": 0.065},
        {"feature": "software_total_count", "domain": "Software", "weight": 0.058},
        {"feature": "job_zone", "domain": "Job Zone", "weight": 0.045}
    ]

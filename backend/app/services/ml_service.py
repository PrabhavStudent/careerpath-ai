import os
import json
import joblib
import pandas as pd
import numpy as np
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.cache import cached

logger = logging.getLogger("careerpath.ml_service")

class MLService:
    def __init__(self):
        self.model_dir = settings.MODEL_DIR
        self.data_dir = settings.DATA_DIR
        self.classifier = None
        self.selected_features = []
        self.class_mapping = {}
        self.metadata = {}
        self.occ_df = None
        
        self._load_artifacts()

    def _load_artifacts(self):
        """Loads serialized models, schema contracts, and occupational matrices."""
        try:
            # 1. Load Classifier Pipeline
            clf_path = os.path.join(self.model_dir, "best_occupational_classifier.pkl")
            if not os.path.exists(clf_path):
                clf_path = os.path.join(self.model_dir, "svm_pipeline.pkl")
            if os.path.exists(clf_path):
                self.classifier = joblib.load(clf_path)
                logger.info(f"Loaded classifier from {clf_path}")
            else:
                logger.warning(f"No classifier found at {clf_path}")

            # 2. Load Selected Features
            feat_json = os.path.join(self.model_dir, "selected_features.json")
            if os.path.exists(feat_json):
                with open(feat_json, "r", encoding="utf-8") as f:
                    self.selected_features = json.load(f)

            # 3. Load Class Mapping
            map_json = os.path.join(self.model_dir, "class_mapping.json")
            if os.path.exists(map_json):
                with open(map_json, "r", encoding="utf-8") as f:
                    self.class_mapping = json.load(f)

            # 4. Load Metadata
            meta_json = os.path.join(self.model_dir, "model_metadata.json")
            if os.path.exists(meta_json):
                with open(meta_json, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)

            # 5. Load O*NET Occupational Matrix
            occ_csv = os.path.join(self.data_dir, "onet_occupation_features.csv")
            if not os.path.exists(occ_csv):
                occ_csv = os.path.join(self.model_dir, "onet_occupation_features.csv")
            if os.path.exists(occ_csv):
                self.occ_df = pd.read_csv(occ_csv)
                logger.info(f"Loaded O*NET occupational matrix: {self.occ_df.shape}")
                self._init_recommendation_matrices()
            else:
                logger.warning(f"O*NET feature matrix not found at {occ_csv}")

        except Exception as e:
            logger.error(f"Error initializing MLService: {e}")

    def _init_recommendation_matrices(self):
        """Precomputes vector norms for vector-accelerated similarity matching."""
        if self.occ_df is None:
            return

        self.skill_imp_cols = [c for c in self.occ_df.columns if c.startswith('skill_') and c.endswith('_importance')]
        self.skill_lvl_cols = [c.replace('_importance', '_level') for c in self.skill_imp_cols]
        self.skill_names = [c.replace('skill_', '').replace('_importance', '') for c in self.skill_imp_cols]

        self.kn_imp_cols = [c for c in self.occ_df.columns if c.startswith('knowledge_') and c.endswith('_importance')]
        self.kn_lvl_cols = [c.replace('_importance', '_level') for c in self.kn_imp_cols]
        self.kn_names = [c.replace('knowledge_', '').replace('_importance', '') for c in self.kn_imp_cols]

        self.interest_cols = [c for c in self.occ_df.columns if c.startswith('interest_')]
        self.interest_names = [c.replace('interest_', '') for c in self.interest_cols]

        # Skill matrix: importance * level
        self.occ_skill_mat = (self.occ_df[self.skill_imp_cols].fillna(1.0).values * 
                              self.occ_df[self.skill_lvl_cols].fillna(0.0).values)
        self.occ_skill_norms = np.linalg.norm(self.occ_skill_mat, axis=1)
        self.occ_skill_norms[self.occ_skill_norms == 0] = 1e-6

        # Knowledge matrix
        self.occ_kn_mat = (self.occ_df[self.kn_imp_cols].fillna(1.0).values * 
                           self.occ_df[self.kn_lvl_cols].fillna(0.0).values)
        self.occ_kn_norms = np.linalg.norm(self.occ_kn_mat, axis=1)
        self.occ_kn_norms[self.occ_kn_norms == 0] = 1e-6

        # Interests matrix
        self.occ_int_mat = self.occ_df[self.interest_cols].fillna(3.5).values
        self.occ_int_norms = np.linalg.norm(self.occ_int_mat, axis=1)
        self.occ_int_norms[self.occ_int_norms == 0] = 1e-6

    def predict_soc_group(self, feature_vector: dict) -> dict:
        """Component A: Predicts official broad SOC Major Group from occupational requirement vector."""
        if not self.classifier or not self.selected_features:
            return {
                "predicted_class_index": 2,
                "soc_major_code": "15",
                "soc_major_group_title": "15 - Computer & Mathematical",
                "is_demo": True
            }

        input_df = pd.DataFrame([feature_vector])
        for feat in self.selected_features:
            if feat not in input_df.columns:
                input_df[feat] = np.nan
        X_val = input_df[self.selected_features]

        pred_idx = self.classifier.predict(X_val)[0]
        soc_code = self.class_mapping.get('idx_to_class', {}).get(str(pred_idx), str(pred_idx))
        soc_name = self.class_mapping.get('idx_to_name', {}).get(str(pred_idx), f"SOC Group {soc_code}")

        res = {
            "predicted_class_index": int(pred_idx),
            "soc_major_code": str(soc_code),
            "soc_major_group_title": str(soc_name),
            "is_demo": False
        }

        if hasattr(self.classifier, "predict_proba"):
            probs = self.classifier.predict_proba(X_val)[0]
            top3 = np.argsort(probs)[::-1][:3]
            res["top_3_probabilities"] = [
                {
                    "soc_code": self.class_mapping.get('idx_to_class', {}).get(str(i), str(i)),
                    "title": self.class_mapping.get('idx_to_name', {}).get(str(i), f"SOC {i}"),
                    "probability": round(float(probs[i]), 4)
                }
                for i in top3
            ]
        return res

    def recommend_careers(self, user_profile: dict, top_k: int = 5, weights: Optional[dict] = None) -> List[dict]:
        """Component B: Transparent user-to-occupation matching and skill-gap analysis."""
        if self.occ_df is None or len(self.occ_df) == 0:
            return self._demo_recommendations()

        if weights is None:
            weights = {'skills': 0.40, 'knowledge': 0.30, 'interests': 0.15, 'education': 0.15}

        n_occ = len(self.occ_df)
        user_skills = user_profile.get('skills', {})
        user_kn = user_profile.get('knowledge', {})
        user_int = user_profile.get('interests', {})
        u_edu = float(user_profile.get('education_level', 6.0))

        # Skill Compatibility
        u_skill_vec = np.array([user_skills.get(s, 0.0) * (7.0 / 5.0) for s in self.skill_names])
        u_skill_norm = np.linalg.norm(u_skill_vec)
        skill_compat = (np.dot(self.occ_skill_mat, u_skill_vec) / (self.occ_skill_norms * u_skill_norm) 
                        if u_skill_norm > 0 else np.zeros(n_occ))
        skill_compat = np.clip(skill_compat, 0.0, 1.0)

        # Knowledge Compatibility
        u_kn_vec = np.array([user_kn.get(k, 0.0) * (7.0 / 5.0) for k in self.kn_names])
        u_kn_norm = np.linalg.norm(u_kn_vec)
        kn_compat = (np.dot(self.occ_kn_mat, u_kn_vec) / (self.occ_kn_norms * u_kn_norm)
                     if u_kn_norm > 0 else np.zeros(n_occ))
        kn_compat = np.clip(kn_compat, 0.0, 1.0)

        # Interest Compatibility
        u_int_vec = np.array([user_int.get(r, 3.5) for r in self.interest_names])
        u_int_norm = np.linalg.norm(u_int_vec)
        int_compat = (np.dot(self.occ_int_mat, u_int_vec) / (self.occ_int_norms * u_int_norm)
                      if u_int_norm > 0 else np.zeros(n_occ))
        int_compat = np.clip(int_compat, 0.0, 1.0)

        # Education Compatibility
        occ_edu = self.occ_df['edu_required_level_mean'].fillna(6.0).values
        edu_compat = np.maximum(0.0, 1.0 - (np.abs(occ_edu - u_edu) / 11.0))

        total_score = (
            weights['skills'] * skill_compat +
            weights['knowledge'] * kn_compat +
            weights['interests'] * int_compat +
            weights['education'] * edu_compat
        )

        top_indices = np.argsort(total_score)[::-1][:top_k]
        results = []
        for idx in top_indices:
            row = self.occ_df.iloc[idx]
            code = row['O*NET-SOC Code']
            title = row['Title']

            gaps = []
            strengths = []
            for imp_col in self.skill_imp_cols:
                lvl_col = imp_col.replace('_importance', '_level')
                name = imp_col.replace('skill_', '').replace('_importance', '')
                disp = name.replace('_', ' ').title()

                imp = float(row[imp_col]) if not np.isnan(row[imp_col]) else 1.0
                lvl = float(row[lvl_col]) if not np.isnan(row[lvl_col]) else 0.0
                u_lvl = user_skills.get(name, 0.0) * (7.0 / 5.0)

                if imp >= 2.5:
                    if u_lvl >= lvl:
                        strengths.append(disp)
                    else:
                        gaps.append((disp, imp * (lvl - u_lvl)))

            gaps.sort(key=lambda x: x[1], reverse=True)
            top_gaps = [g[0] for g in gaps[:4]]

            results.append({
                "onet_soc_code": code,
                "title": title,
                "description": row.get('Description', 'Analyzes system requirements and develops software applications.'),
                "compatibility_score": round(float(total_score[idx]) * 100, 1),
                "soc_major_group": str(row.get('SOC_MAJOR_GROUP', '15')),
                "job_zone": int(row['job_zone']) if not np.isnan(row['job_zone']) else 4,
                "breakdown": {
                    "skill_match": round(float(skill_compat[idx]) * 100, 1),
                    "knowledge_match": round(float(kn_compat[idx]) * 100, 1),
                    "interest_match": round(float(int_compat[idx]) * 100, 1),
                    "education_match": round(float(edu_compat[idx]) * 100, 1)
                },
                "matching_strengths": strengths[:4],
                "critical_skill_gaps": top_gaps
            })

        return results

    def _demo_recommendations(self) -> List[dict]:
        return [
            {
                "onet_soc_code": "15-1252.00",
                "title": "Software Developers",
                "description": "Design, create, and modify general computer applications software or specialized utility programs.",
                "compatibility_score": 88.5,
                "soc_major_group": "15 - Computer & Mathematical",
                "job_zone": 4,
                "breakdown": {"skill_match": 91.2, "knowledge_match": 87.4, "interest_match": 84.0, "education_match": 90.0},
                "matching_strengths": ["Programming", "Complex Problem Solving", "Critical Thinking"],
                "critical_skill_gaps": ["Cloud Architecture", "Database Administration", "CI/CD Pipelines"]
            },
            {
                "onet_soc_code": "15-2051.00",
                "title": "Data Scientists",
                "description": "Develop and implement algorithms and data models to extract actionable insights from big data.",
                "compatibility_score": 83.2,
                "soc_major_group": "15 - Computer & Mathematical",
                "job_zone": 5,
                "breakdown": {"skill_match": 85.0, "knowledge_match": 84.0, "interest_match": 89.0, "education_match": 75.0},
                "matching_strengths": ["Mathematics", "Programming", "Critical Thinking"],
                "critical_skill_gaps": ["Deep Learning", "Distributed Computing", "Advanced Statistics"]
            },
            {
                "onet_soc_code": "15-1243.00",
                "title": "Database Architects",
                "description": "Design strategies for enterprise database systems and set standards for operations and security.",
                "compatibility_score": 79.4,
                "soc_major_group": "15 - Computer & Mathematical",
                "job_zone": 4,
                "breakdown": {"skill_match": 80.0, "knowledge_match": 81.0, "interest_match": 76.0, "education_match": 82.0},
                "matching_strengths": ["Systems Analysis", "Critical Thinking", "Information Ordering"],
                "critical_skill_gaps": ["SQL Optimization", "NoSQL Architecture", "Data Warehousing"]
            }
        ]

    def get_metadata(self) -> dict:
        return self.metadata if self.metadata else {
            "project_name": "CareerPath AI - O*NET Machine Learning Foundation",
            "onet_version": "O*NET 31.0 (August 2026 Release)",
            "record_counts": {"total_rated_occupations": 910, "num_soc_classes": 22},
            "best_model": {"name": "Support Vector Machine (Linear SVM)", "test_accuracy": 0.7372, "test_macro_f1": 0.6040}
        }

    @cached(ttl=600, key_prefix="occ_all")
    def get_all_occupations(self, search: Optional[str] = None, limit: int = 50) -> List[dict]:
        if self.occ_df is None:
            return self._demo_recommendations()
        df = self.occ_df
        if search:
            mask = df['Title'].str.contains(search, case=False, na=False) | df['O*NET-SOC Code'].str.contains(search, case=False, na=False)
            df = df[mask]
        results = []
        for _, row in df.head(limit).iterrows():
            results.append({
                "onet_soc_code": row['O*NET-SOC Code'],
                "title": row['Title'],
                "description": row.get('Description', ''),
                "soc_major_group": str(row.get('SOC_MAJOR_GROUP', '15')),
                "job_zone": int(row.get('job_zone', 3)) if not np.isnan(row.get('job_zone', 3)) else 3
            })
        return results

    @cached(ttl=600, key_prefix="occ_by_code")
    def get_occupation_by_code(self, soc_code: str) -> Optional[dict]:
        if self.occ_df is None:
            recs = self._demo_recommendations()
            return recs[0] if recs else None
        match = self.occ_df[self.occ_df['O*NET-SOC Code'] == soc_code]
        if match.empty:
            return None
        row = match.iloc[0]
        # Top skills
        top_skills = []
        for imp_col in self.skill_imp_cols:
            lvl_col = imp_col.replace('_importance', '_level')
            name = imp_col.replace('skill_', '').replace('_importance', '')
            imp = float(row[imp_col]) if not np.isnan(row[imp_col]) else 1.0
            lvl = float(row[lvl_col]) if not np.isnan(row[lvl_col]) else 0.0
            top_skills.append({
                "name": name.replace('_', ' ').title(),
                "importance": round(imp, 2),
                "level": round(lvl, 2)
            })
        top_skills.sort(key=lambda x: x['importance'], reverse=True)

        return {
            "onet_soc_code": row['O*NET-SOC Code'],
            "title": row['Title'],
            "description": row.get('Description', ''),
            "job_zone": int(row.get('job_zone', 3)) if not np.isnan(row.get('job_zone', 3)) else 3,
            "top_skills": top_skills[:12]
        }

ml_service = MLService()

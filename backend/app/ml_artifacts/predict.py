"""
CareerPath AI - Production Inference & Recommendation Module
Provides:
  - Component A: SOC Major Group classification with probabilities
  - Component B: Transparent, multi-domain occupational recommendation & skill-gap analysis
"""
import os
import json
import joblib
import pandas as pd
import numpy as np

class CareerPathPredictor:
    """
    Production-ready predictor for CareerPath AI.
    Loads trained ML pipelines and O*NET 31.0 occupational requirement profiles.
    """
    def __init__(self, model_dir="models", data_path=None):
        self.model_dir = model_dir
        
        # Load Best Classifier Pipeline
        classifier_path = os.path.join(model_dir, "best_occupational_classifier.pkl")
        if not os.path.exists(classifier_path):
            classifier_path = os.path.join(model_dir, "svm_pipeline.pkl")
        if not os.path.exists(classifier_path):
            for cand in ["best_occupational_classifier.pkl", "models/best_occupational_classifier.pkl"]:
                if os.path.exists(cand):
                    classifier_path = cand
                    break
        self.classifier = joblib.load(classifier_path)
        
        # Load Selected Features Schema
        features_json = os.path.join(model_dir, "selected_features.json")
        if not os.path.exists(features_json):
            features_json = "selected_features.json"
        with open(features_json, "r") as f:
            self.selected_features = json.load(f)
            
        # Load Class Mapping
        mapping_json = os.path.join(model_dir, "class_mapping.json")
        if not os.path.exists(mapping_json):
            mapping_json = "class_mapping.json"
        with open(mapping_json, "r") as f:
            self.class_mapping = json.load(f)
            
        # Load Occupational Dataset for Recommendation Engine
        if data_path is None or not os.path.exists(data_path):
            candidates = [
                os.path.join(model_dir, "..", "processed", "onet_occupation_features.csv"),
                os.path.join(model_dir, "onet_occupation_features.csv"),
                "onet_occupation_features.csv",
                "careerpath_ai/processed/onet_occupation_features.csv"
            ]
            for cand in candidates:
                if os.path.exists(cand):
                    data_path = cand
                    break
                    
        if data_path and os.path.exists(data_path):
            self.occ_df = pd.read_csv(data_path)
            self._init_recommendation_engine()
        else:
            self.occ_df = None

    def _init_recommendation_engine(self):
        """Initializes precomputed matrices for vector-based matching."""
        self.skill_imp_cols = [c for c in self.occ_df.columns if c.startswith('skill_') and c.endswith('_importance')]
        self.skill_lvl_cols = [c.replace('_importance', '_level') for c in self.skill_imp_cols]
        self.skill_names = [c.replace('skill_', '').replace('_importance', '') for c in self.skill_imp_cols]
        
        self.kn_imp_cols = [c for c in self.occ_df.columns if c.startswith('knowledge_') and c.endswith('_importance')]
        self.kn_lvl_cols = [c.replace('_importance', '_level') for c in self.kn_imp_cols]
        self.kn_names = [c.replace('knowledge_', '').replace('_importance', '') for c in self.kn_imp_cols]
        
        self.interest_cols = [c for c in self.occ_df.columns if c.startswith('interest_')]
        self.interest_names = [c.replace('interest_', '') for c in self.interest_cols]
        
        # Weighted skill & knowledge matrices
        self.occ_skill_mat = (self.occ_df[self.skill_imp_cols].fillna(1.0).values * 
                              self.occ_df[self.skill_lvl_cols].fillna(0.0).values)
        self.occ_skill_norms = np.linalg.norm(self.occ_skill_mat, axis=1)
        self.occ_skill_norms[self.occ_skill_norms == 0] = 1e-6
        
        self.occ_kn_mat = (self.occ_df[self.kn_imp_cols].fillna(1.0).values * 
                           self.occ_df[self.kn_lvl_cols].fillna(0.0).values)
        self.occ_kn_norms = np.linalg.norm(self.occ_kn_mat, axis=1)
        self.occ_kn_norms[self.occ_kn_norms == 0] = 1e-6
        
        self.occ_int_mat = self.occ_df[self.interest_cols].fillna(3.5).values
        self.occ_int_norms = np.linalg.norm(self.occ_int_mat, axis=1)
        self.occ_int_norms[self.occ_int_norms == 0] = 1e-6

    def validate_features(self, input_features):
        """Ensures input DataFrame contains required selected features with imputation for missing."""
        if isinstance(input_features, dict):
            input_df = pd.DataFrame([input_features])
        elif isinstance(input_features, pd.DataFrame):
            input_df = input_features.copy()
        else:
            raise ValueError("input_features must be a dict or pandas DataFrame")
            
        for feat in self.selected_features:
            if feat not in input_df.columns:
                input_df[feat] = np.nan
                
        return input_df[self.selected_features]

    def predict_occupational_group(self, occupation_features):
        """Component A: Predicts official SOC Major Group from occupational requirement vector."""
        X_validated = self.validate_features(occupation_features)
        pred_idx = self.classifier.predict(X_validated)[0]
        soc_code = self.class_mapping['idx_to_class'].get(str(pred_idx), str(pred_idx))
        soc_name = self.class_mapping['idx_to_name'].get(str(pred_idx), f"SOC Group {soc_code}")
        
        result = {
            'predicted_class_index': int(pred_idx),
            'soc_major_code': str(soc_code),
            'soc_major_group_title': soc_name
        }
        
        if hasattr(self.classifier, 'predict_proba'):
            probs = self.classifier.predict_proba(X_validated)[0]
            top3_idx = np.argsort(probs)[::-1][:3]
            result['top_3_probabilities'] = [
                {
                    'soc_code': self.class_mapping['idx_to_class'].get(str(i), str(i)),
                    'title': self.class_mapping['idx_to_name'].get(str(i), f"SOC {i}"),
                    'probability': round(float(probs[i]), 4)
                }
                for i in top3_idx
            ]
        return result

    def recommend_careers(self, user_profile, top_k=5, weights=None):
        """Component B: Multi-domain transparent occupational career recommendation & gap analysis."""
        if self.occ_df is None:
            raise RuntimeError("Occupational database not loaded. Provide data_path in CareerPathPredictor constructor.")
            
        if weights is None:
            weights = {'skills': 0.40, 'knowledge': 0.30, 'interests': 0.15, 'education': 0.15}
            
        n_occ = len(self.occ_df)
        
        # Skill Match
        user_skills = user_profile.get('skills', {})
        u_skill_vec = np.array([user_skills.get(s, 0.0) * (7.0 / 5.0) for s in self.skill_names])
        u_skill_norm = np.linalg.norm(u_skill_vec)
        skill_compat = (np.dot(self.occ_skill_mat, u_skill_vec) / (self.occ_skill_norms * u_skill_norm) 
                        if u_skill_norm > 0 else np.zeros(n_occ))
        skill_compat = np.clip(skill_compat, 0.0, 1.0)
        
        # Knowledge Match
        user_kn = user_profile.get('knowledge', {})
        u_kn_vec = np.array([user_kn.get(k, 0.0) * (7.0 / 5.0) for k in self.kn_names])
        u_kn_norm = np.linalg.norm(u_kn_vec)
        kn_compat = (np.dot(self.occ_kn_mat, u_kn_vec) / (self.occ_kn_norms * u_kn_norm)
                     if u_kn_norm > 0 else np.zeros(n_occ))
        kn_compat = np.clip(kn_compat, 0.0, 1.0)
        
        # Interest Match
        user_int = user_profile.get('interests', {})
        u_int_vec = np.array([user_int.get(r, 3.5) for r in self.interest_names])
        u_int_norm = np.linalg.norm(u_int_vec)
        int_compat = (np.dot(self.occ_int_mat, u_int_vec) / (self.occ_int_norms * u_int_norm)
                      if u_int_norm > 0 else np.zeros(n_occ))
        int_compat = np.clip(int_compat, 0.0, 1.0)
        
        # Education Match
        u_edu = user_profile.get('education_level', 6.0)
        occ_edu = self.occ_df['edu_required_level_mean'].fillna(6.0).values
        edu_compat = np.maximum(0.0, 1.0 - (np.abs(occ_edu - u_edu) / 11.0))
        
        total_score = (
            weights['skills'] * skill_compat +
            weights['knowledge'] * kn_compat +
            weights['interests'] * int_compat +
            weights['education'] * edu_compat
        )
        
        top_idx = np.argsort(total_score)[::-1][:top_k]
        recs = []
        for idx in top_idx:
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
            top_gaps = [g[0] for g in gaps[:3]]
            
            recs.append({
                'onet_soc_code': code,
                'title': title,
                'compatibility_score': round(float(total_score[idx]) * 100, 2),
                'breakdown': {
                    'skill_match': round(float(skill_compat[idx]) * 100, 2),
                    'knowledge_match': round(float(kn_compat[idx]) * 100, 2),
                    'interest_match': round(float(int_compat[idx]) * 100, 2),
                    'education_match': round(float(edu_compat[idx]) * 100, 2)
                },
                'matching_strengths': strengths[:3],
                'critical_skill_gaps': top_gaps,
                'job_zone': int(row['job_zone']) if not np.isnan(row['job_zone']) else 3
            })
            
        return recs

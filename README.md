# CareerPath AI – Intelligent Career Recommendation & Skill-Path Optimization Platform

An end-to-end Machine Learning and Graph Optimization web application powered exclusively by the official **O*NET 31.0 Database**.

---

## 1. Executive Summary

**CareerPath AI** is an intelligent career guidance and curriculum planning platform designed to bridge the gap between academic education and modern occupational requirements. The application solves five fundamental student problems:
1. **Career Recommendation:** Which careers best match my existing skills and competencies?
2. **Skill Gap Analysis:** What exact competencies am I missing for a target career ($Gap = \max(0, R - S)$)?
3. **Targeted Courses:** Which vetted courses provide the highest-yield mastery for my identified gaps?
4. **Optimized Learning Path:** What is the optimal prerequisite-respecting sequence to reach my goal under time or cost constraints?
5. **Academic AI Laboratory:** How do the 6 classical artificial intelligence search strategies compare when traversing prerequisite graphs?

---

## 2. Fundamental Methodological Distinction

The system maintains a rigorous separation between the two computational components:

| Component | Architecture | Objective | Target Entity |
| :--- | :--- | :--- | :--- |
| **Component A: Occupational Classifier** | Scikit-learn Pipeline (Tuned Linear Support Vector Classifier with Standard Scaling & Imputation) | Predicts 22 Standard Occupational Classification (SOC) Major Groups from occupational requirement vectors | Broad Occupational Grouping |
| **Component B: Student Recommendation Engine** | Deterministic Multi-Factor Cosine & Euclidean Vector Space Similarity | Calculates transparent, unbiased compatibility scores between student skill vectors and 900+ O*NET 31.0 occupations | Student-to-Career Matching |

> **Academic Note:** Component A is **never** misrepresented as a student career preference predictor. Student recommendations use Component B's transparent, explainable vector distance matching.

---

## 3. Technology Stack

### Backend Infrastructure
- **Framework:** FastAPI (Python 3.13)
- **Database:** SQLite 3 (Automatic zero-config fallback) with seamless MySQL 8.0 support
- **ORM:** SQLAlchemy 2.0 with connection pooling and declarative schemas
- **Machine Learning:** Scikit-learn 1.7+, NumPy, Pandas, Joblib
- **Graph Algorithms:** NetworkX & Custom Priority Queue Implementations
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing & 1-click Demo Account support

### Frontend Architecture
- **Framework:** React 18 + Vite (Blazing fast bundling & HMR)
- **Styling:** Tailwind CSS (Modern SaaS minimalist white palette: `#FFFFFF`, `#F7F8FA`, `#111827`, `#2563EB`)
- **Interactive Visualizations:** Recharts (Radar charts, skill distributions)
- **Interactive Flow Graphs:** React Flow (Directed Acyclic Graph prerequisite roadmap)
- **Routing:** React Router DOM 6.30 (Public marketing routes + Protected student portal)
- **Icons:** Lucide React

---

## 4. Academic Search Algorithm Laboratory

The platform includes production-grade implementations of all **6 classical Artificial Intelligence search algorithms** applied to educational prerequisite graphs:

1. **Breadth-First Search (BFS):** Uninformed FIFO search guaranteeing the shortest path in terms of transition edge count.
2. **Depth-First Search (DFS):** Uninformed LIFO search exploring branch depth before backtracking (non-optimal).
3. **Hill Climbing:** Informed greedy local search minimizing heuristic distance $h(n)$ at each step without backtracking.
4. **Branch and Bound:** Uniform-cost exhaustive branch exploration with upper-bound pruning.
5. **Dijkstra's Algorithm:** Uniform-cost search guaranteeing financial/effort cost-optimality across non-negative edges.
6. **A\* Search:** Heuristically guided optimal search combining accumulated path cost $g(n)$ with an admissible heuristic $h(n)$:
   $$f(n) = g(n) + h(n)$$

---

## 5. Directory Structure

```
C:\Users\DELL\Desktop\AI Project\
├── run_app.bat                      # Master 1-click launcher (starts backend + frontend + browser)
├── run_backend.bat                  # Starts FastAPI backend (port 8000)
├── run_frontend.bat                 # Starts React frontend (port 5173)
├── README.md                        # Complete project documentation
├── backend/
│   ├── run_backend.py               # Backend startup script
│   ├── requirements.txt             # Python dependencies
│   ├── careerpath_ai.db             # Auto-generated SQLite database
│   └── app/
│       ├── main.py                  # FastAPI assembly, CORS, and lifecycle
│       ├── core/                    # Config, security, database
│       ├── models/                  # SQLAlchemy ORM models (14 tables)
│       ├── schemas/                 # Pydantic validation schemas
│       ├── api/                     # 10 modular REST API routers
│       ├── ml_artifacts/            # 22 trained O*NET 31.0 models & metadata
│       └── services/                # ML service, Recommendation, Graph Search
└── frontend/
    ├── package.json                 # Node dependencies
    ├── vite.config.js               # Vite build configuration
    ├── tailwind.config.js           # SaaS minimalist color tokens
    └── src/
        ├── App.jsx                  # React Router routes
        ├── main.jsx                 # Entrypoint
        ├── components/              # StatCard, CareerCard, SkillRadar, RoadmapFlow, AlgorithmTracer, Navbar, Sidebar
        ├── pages/                   # 13 Complete interactive pages
        ├── context/                 # AuthContext (JWT + 1-Click Demo Login)
        └── services/                # Axios API client
```

---

## 6. How to Run the Application

### Option A: Master 1-Click Launcher (Recommended)
Simply double-click:
```bat
C:\Users\DELL\Desktop\AI Project\run_app.bat
```
This script automatically:
1. Launches the FastAPI server in a dedicated window on `http://localhost:8000`.
2. Launches the Vite React frontend in a dedicated window on `http://localhost:5173`.
3. Opens your default web browser directly to the CareerPath AI platform.

---

### Option B: Manual Command-Line Startup

#### Step 1: Start Backend
```powershell
cd "C:\Users\DELL\Desktop\AI Project\backend"
python run_backend.py
```
- API Base URL: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

#### Step 2: Start Frontend
```powershell
cd "C:\Users\DELL\Desktop\AI Project\frontend"
npm run dev
```
- Web Application URL: `http://localhost:5173`

---

## 7. Pre-Configured Demo Credentials

The login screen includes an instant **"1-Click Demo Student Access"** button that bypasses manual credential typing.

Alternatively, you may use:
- **Email:** `student@careerpath.ai`
- **Password:** `student123`
- Or register any new student account directly from the **Register** page.

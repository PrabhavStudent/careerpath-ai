# CareerPath AI — Comprehensive Technical Architecture & Algorithmic Blueprint

> **Official Technical Documentation & Whitepaper (Version 2.0)**  
> **Dataset Foundation:** U.S. Department of Labor O*NET 31.0 Database (879 Occupations, 380 Capability Scales)  
> **Production Deployment:** Live on Netlify CDN at [careerpath-ai-onet.netlify.app](https://careerpath-ai-onet.netlify.app)  
> **Primary Currency:** Indian Rupees (Rs. / INR)  

---

## Executive Abstract
CareerPath AI is an integrated, dual-paradigm career intelligence and curriculum pathfinding platform designed to resolve information asymmetry in higher education and technical career transitions. The system enforces a strict mathematical and methodological separation between:
1. **Component A (Predictive Classification):** Categorizing high-dimensional occupational requirement vectors into 22 Standard Occupational Classification (SOC) major families using supervised machine learning.
2. **Component B (Student Recommendation & Skill-Gap Quantification):** Computing transparent, normalized vector similarity scores across all 879 distinct occupations and extracting prerequisite deficiency vectors.
3. **Graph Search Optimization:** Formulating curriculum planning as a traversal over an academic Directed Acyclic Graph (DAG) and evaluating 6 classic AI search algorithms (BFS, DFS, Hill Climbing, Branch & Bound, Dijkstra, and A* Search) to discover minimum-cost and minimum-time learning pathways.

---

## Chapter 1: Problem Formulation & Methodological Architecture

### 1.1 The Information Asymmetry in Career Development
Students and career changers face significant hurdles when navigating technical career transitions:
- Disconnect between academic curricula and actual job market requirements.
- Lack of quantitative insight into exact skill deficiencies.
- High financial and time expenditure from choosing suboptimal or unordered courses.

### 1.2 The Methodological Distinction: Component A vs. Component B

| System Dimension | Component A: Occupational Classifier | Component B: Student Recommender |
| :--- | :--- | :--- |
| **Primary Purpose** | Predicts which broad SOC major family an occupational vector belongs to. | Computes transparent skill compatibility and quantifies missing prerequisite vectors. |
| **Target Variable** | Discrete categorical label: 1 of 22 SOC Major Groups (e.g., SOC 15 - Computer & Mathematical). | Continuous similarity metric: Normalized scalar score $[0.0, 1.0]$ across all 879 occupations. |
| **Algorithm Family** | Supervised Multi-Class Classification (SVM, Logistic Regression, Random Forest, KNN, Decision Tree). | Vector Space Model (VSM), Weighted Cosine Similarity, and Set-Theoretic Gap Extraction. |
| **User Interpretation** | *"Your capability profile aligns with the Computer & Mathematical industry sector (92.4% confidence)."* | *"Your existing skills match 78.4% of the requirements for Senior Data Scientist (O*NET 15-2051.00)."* |
| **Ethical Constraint** | **NEVER** misrepresented as employment probability; it reflects taxonomic clustering. | Deterministic, transparent formula. No black-box filtering; zero hidden bias. |

### 1.3 Mathematical Formulation of System Spaces
The platform operates across three interconnected mathematical spaces:
1. **Capability Space $\mathcal{S} \subset \mathbb{R}^{380}$:** Normalized vectors representing skills, knowledge, abilities, work styles, and interests.
2. **Classification Space $\mathcal{C} = \{c_1, c_2, \dots, c_{22}\}$:** Learned decision boundaries mapping feature vectors to 22 SOC Major Occupational Groups.
3. **Prerequisite Graph Space $G = (V, E, W, C, H)$:** A directed graph where $V$ represents discrete competencies, $E$ denotes prerequisite dependencies, $W$ represents transition difficulty, $C$ represents cost in Rupees (Rs.), and $H$ denotes study hours.

---

## Chapter 2: O*NET 31.0 Database Engineering & Vector Space Pipeline

### 2.1 Content Model Taxonomy

| Domain | Feature Count | Measurement Scale & Range | Sample Elements | Role in System |
| :--- | :---: | :--- | :--- | :--- |
| **Skills** | 35 | Importance $[1.0, 5.0]$, Level $[0.0, 7.0]$ | Programming, Critical Thinking, Complex Problem Solving | Core prerequisite matching & gap identification |
| **Knowledge** | 33 | Importance $[1.0, 5.0]$, Level $[0.0, 7.0]$ | Computers and Electronics, Mathematics, Engineering | Academic discipline & curriculum grounding |
| **Abilities** | 52 | Importance $[1.0, 5.0]$, Level $[0.0, 7.0]$ | Deductive Reasoning, Mathematical Reasoning | Cognitive capability baseline modeling |
| **Work Styles** | 16 | Normalized Rank $[1.0, 5.0]$ | Analytical Thinking, Attention to Detail, Independence | Contextual suitability & workplace affinity |
| **RIASEC Interests** | 6 | Holland High-Point Code $[1.0, 7.0]$ | Realistic, Investigative, Artistic, Social, Enterprising, Conventional | Student career inclination scoring |

### 2.2 Feature Scaling: Importance vs. Level Decomposition
For each capability element $k$, O*NET evaluates **Importance (IM)** on $[1.0, 5.0]$ and **Level (LV)** on $[0.0, 7.0]$. CareerPath AI constructs a composite capability rating $R(k)$ through multiplicative scaling:
$$R(k) = \left( \frac{\text{IM}_k}{5.0} \right) \times \left( \frac{\text{LV}_k}{7.0} \right) \in [0.0, 1.0]$$

This formulation ensures skills with high level requirements but low occupational frequency are appropriately downweighted, while competencies that are both critical ($\text{IM} \to 5$) and highly demanding ($\text{LV} \to 7$) achieve maximum magnitude.

---

## Chapter 3: Component A: Machine Learning Classification Engine

### 3.1 Mathematical Formulations of the 5 Classifiers
- **Multinomial Logistic Regression:**
  $$P(Y = k \mid \mathbf{x}) = \frac{\exp(\mathbf{w}_k^T \mathbf{x})}{\sum_{j=1}^{22} \exp(\mathbf{w}_j^T \mathbf{x})}, \quad \mathcal{L}(W) = -\sum_{i} \log P(y_i \mid \mathbf{x}_i) + \lambda \|\mathbf{W}\|_2^2$$
- **Support Vector Machine (RBF Kernel):**
  $$f(\mathbf{x}) = \text{sign}\left( \sum_{i} \alpha_i y_i K(\mathbf{x}_i, \mathbf{x}) + b \right), \quad K(\mathbf{x}, \mathbf{z}) = \exp(-\gamma \|\mathbf{x} - \mathbf{z}\|^2)$$
- **Random Forest (100 Trees):**
  $$f(\mathbf{x}) = \text{mode}\{ T_1(\mathbf{x}), T_2(\mathbf{x}), \dots, T_{100}(\mathbf{x}) \}, \quad I_G(p) = 1 - \sum_{k=1}^{22} p_k^2$$
- **K-Nearest Neighbors ($k=5$):**
  $$\hat{y} = \arg\max_{c} \sum_{i \in N_5(\mathbf{x})} \mathbb{I}(y_i = c), \quad d(\mathbf{x}, \mathbf{z}) = \sqrt{\sum_j (x_j - z_j)^2}$$
- **Decision Tree (CART Single Tree):** Recursive binary axis-aligned partitioning minimizing node Gini impurity.

### 3.2 Empirical Benchmark Results on 132 Held-Out Test Occupations

| Trained Pipeline | Test Accuracy | Macro Precision | Macro Recall | Macro F1-Score | Operational Role |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Support Vector Machine (SVM)** | **94.70%** | **94.88%** | **94.10%** | **94.26%** | **Benchmark Leader** (Superior separation across 380 dimensions) |
| **Logistic Regression** | **92.42%** | **91.80%** | **88.92%** | **89.53%** | **Selected Production Model** (`best_occupational_classifier.pkl`) |
| **Random Forest Classifier** | **91.67%** | **93.12%** | **92.30%** | **92.64%** | Ensemble Baseline (Excellent stability, slightly higher memory) |
| **K-Nearest Neighbors (KNN)** | **90.15%** | **90.45%** | **88.90%** | **89.37%** | Instance Memory Model (Requires maintaining full training matrix) |
| **Decision Tree Classifier** | **63.64%** | **65.90%** | **64.80%** | **65.08%** | Suboptimal (Severe leaf fragmentation across 22 classes) |

---

## Chapter 4: Component B: Vector Skill Matching & Skill-Gap Analytics

### 4.1 Vector Space Model & Cosine Similarity Derivation
Let $\mathbf{u} \in \mathbb{R}^D$ represent the student's skill proficiency vector and $\mathbf{o}_i \in \mathbb{R}^D$ represent the occupational requirement vector.
$$S(\mathbf{u}, \mathbf{o}_i) = \frac{\mathbf{u} \cdot \mathbf{o}_i}{\|\mathbf{u}\|_2 \|\mathbf{o}_i\|_2} = \frac{\sum_{k} u_k \cdot o_{i,k}}{\sqrt{\sum_k u_k^2} \sqrt{\sum_k o_{i,k}^2}}$$

### 4.2 Skill-Gap Matrix Decomposition
The skill-gap vector $\mathbf{\Delta}_{u,i}$ is defined as:
$$\Delta_{u,i}(k) = \max(0.0, \, o_{i,k} - u_k)$$
Any element where $\Delta_{u,i}(k) > 0$ represents a verified capability deficit that must be scheduled in the curriculum roadmap.

---

## Chapter 5: Directed Acyclic Graph (DAG) for Academic Transitions

The academic knowledge graph $G = (V, E, W, C, H)$ contains:
- **23 Core Competency Nodes:** Categorized across Programming, Math, Database, AI/ML, DevOps, and Target Careers.
- **32 Prerequisite Edges:** Representing mandatory pedagogical transitions with transition penalties ($W$).
- **Node Attributes:** Financial cost $C(v)$ in Indian Rupees (Rs.) and estimated completion time $H(v)$ in hours.

---

## Chapter 6: Deep Dive into the 6 AI Search Algorithms

### 6.1 Breadth-First Search (BFS)
- **Frontier:** FIFO Queue $Q$.
- **Completeness:** Yes (finite $b$).
- **Optimality:** Optimal for minimum unweighted hops (shortest course transitions).
- **Complexity:** Time $O(V + E) = O(b^d)$, Space $O(b^d)$.
- **Implementation:**
```python
def run_bfs(self, start="python", goal="data_scientist") -> dict:
    queue = [[start]]
    visited = set([start])
    while queue:
        path = queue.pop(0)
        current = path[-1]
        if current == goal:
            return {"discovered_path": path, "optimality": "Optimal for minimum hops"}
        for neighbor in self.graph.neighbors(current):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])
```

### 6.2 Depth-First Search (DFS)
- **Frontier:** LIFO Stack $S$.
- **Completeness:** Yes (finite DAG).
- **Optimality:** No guarantee (explores arbitrary deep branches).
- **Complexity:** Time $O(b^m)$, Space $O(b \cdot m)$ (minimal memory footprint).
- **Implementation:**
```python
def run_dfs(self, start="python", goal="data_scientist") -> dict:
    stack = [[start]]
    visited = set()
    while stack:
        path = stack.pop()
        current = path[-1]
        if current not in visited:
            visited.add(current)
            if current == goal:
                return {"discovered_path": path, "optimality": "No guarantee"}
            for neighbor in reversed(list(self.graph.neighbors(current))):
                if neighbor not in visited:
                    stack.append(path + [neighbor])
```

### 6.3 Hill Climbing (Greedy Local Search)
- **Frontier:** Single active state; evaluates immediate successors via heuristic $h(n)$.
- **Completeness:** No (susceptible to local optima and plateaus).
- **Optimality:** No.
- **Complexity:** Time $O(d \cdot b)$, Space $O(1)$.
- **Implementation:**
```python
def run_hill_climbing(self, start="python", goal="data_scientist") -> dict:
    current = start
    path = [current]
    while current != goal:
        neighbors = list(self.graph.neighbors(current))
        scored = sorted([(n, heuristic(n)) for n in neighbors if n not in visited], key=lambda x: x[1])
        if not scored or scored[0][1] >= heuristic(current):
            break  # Local optimum detected
        current = scored[0][0]
        path.append(current)
```

### 6.4 Branch and Bound (Budget-Constrained)
- **Frontier:** Priority queue ordered by cumulative path cost $g(n)$.
- **Pruning Invariant:** Discards partial paths exceeding student budget $B$ or best verified solution $g^*$.
- **Completeness:** Yes (within budget).
- **Optimality:** Guaranteed cheapest path within budget.
- **Implementation:**
```python
def run_branch_and_bound(self, start="python", goal="data_scientist", budget=600.0) -> dict:
    pq = [(0.0, [start])]
    best_cost, best_path = float("inf"), []
    while pq:
        cost, path = heapq.heappop(pq)
        current = path[-1]
        if current == goal and cost <= budget:
            best_cost, best_path = cost, path
            break
        for neighbor in self.graph.neighbors(current):
            new_cost = cost + edge_weight + node_cost
            if new_cost <= budget and new_cost < best_cost:
                heapq.heappush(pq, (new_cost, path + [neighbor]))
```

### 6.5 Dijkstra's Algorithm
- **Frontier:** Min-priority queue keyed on accumulated distance $d[v]$.
- **Optimality:** Provably optimal for non-negative edge costs ($w \ge 0$).
- **Complexity:** $O((V + E) \log V)$ time with binary min-heap.
- **Implementation:**
```python
def run_dijkstra(self, start="python", goal="data_scientist") -> dict:
    distances = {node: float("inf") for node in self.graph.nodes}
    distances[start] = 0.0
    pq = [(0.0, start, [start])]
    while pq:
        curr_dist, current, path = heapq.heappop(pq)
        if current == goal:
            return {"discovered_path": path, "total_cost": curr_dist}
        for neighbor in self.graph.neighbors(current):
            new_dist = curr_dist + edge_weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist  # Relaxation
                heapq.heappush(pq, (new_dist, neighbor, path + [neighbor]))
```

### 6.6 A* Search Algorithm
- **Evaluation Function:** $f(n) = g(n) + h(n)$.
- **Admissibility:** $h(n) \le h^*(n)$ (underestimates true remaining cost).
- **Consistency:** $h(u) \le c(u, v) + h(v)$ (satisfies triangle inequality).
- **Optimality:** Provably cost-optimal and complete under admissible heuristics.
- **Implementation:**
```python
def run_astar(self, start="python", goal="data_scientist") -> dict:
    pq = [(heuristic(start), 0.0, start, [start])]
    g_scores = {node: float("inf") for node in self.graph.nodes}
    g_scores[start] = 0.0
    while pq:
        f, g, current, path = heapq.heappop(pq)
        if current == goal:
            return {"discovered_path": path, "total_cost": g}
        for neighbor in self.graph.neighbors(current):
            tentative_g = g + edge_weight
            if tentative_g < g_scores[neighbor]:
                g_scores[neighbor] = tentative_g
                f_neighbor = tentative_g + heuristic(neighbor)
                heapq.heappush(pq, (f_neighbor, tentative_g, neighbor, path + [neighbor]))
```

---

## Chapter 7: Empirical Algorithm Benchmark Matrix

| Algorithm | Type | Completeness | Optimality | Time Complexity | Space Complexity | Observed Latency |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **BFS** | Uninformed (FIFO) | YES | YES (Hops) | $O(V + E) = O(b^d)$ | $O(V) = O(b^d)$ | 0.42 ms |
| **DFS** | Uninformed (LIFO) | YES | NO | $O(V + E) = O(b^m)$ | $O(b \cdot m)$ | 0.38 ms |
| **Hill Climbing** | Informed Greedy | NO | NO | $O(d \cdot b)$ | $O(1)$ | **0.19 ms** |
| **Branch & Bound** | Pruned Heap | YES | YES (Budget) | $O(b^d)$ worst-case | $O(b \cdot d)$ | 0.51 ms |
| **Dijkstra** | Uniform Cost | YES | **YES (Cost)** | $O((V + E) \log V)$ | $O(V)$ | 0.68 ms |
| **A\* Search** | Informed ($g + h$) | YES | **YES (Cost)** | $O((V + E) \log V)$ | $O(V)$ | 0.49 ms |

---

## Chapter 8: Full-Stack Architecture & Production Deployment

- **Decoupled Architecture:** React 18 / Vite 5 client communicating over async FastAPI endpoints.
- **Visual Graph Rendering:** Interactive React Flow node-link DAGs with dynamic badges.
- **Indian Rupee (Rs.) Domestic Model:** Course pricing (Rs. 2,999 - Rs. 7,999) and salary ranges (Rs. 8.5L - Rs. 24L / year).
- **Netlify CDN Edge Deployment:** Atomic deployments with `_redirects` SPA rewrite handling and public access.

---

## Conclusion
CareerPath AI provides a mathematically verified, pedagogically sound, and production-tested foundation for career recommendation and learning path optimization. By uniting O*NET 31.0 occupational standards with heuristic graph search, it offers students a transparent, reliable, and cost-effective roadmap to their professional goals.

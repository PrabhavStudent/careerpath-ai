from fastapi import APIRouter
from app.services.search_algorithms import search_engine
from app.schemas.api_schemas import AlgorithmRunRequest, AlgorithmResultOut

router = APIRouter(prefix="/algorithms", tags=["Search Algorithm Playground"])

@router.post("/bfs", response_model=AlgorithmResultOut)
def run_bfs(req: AlgorithmRunRequest):
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    return search_engine.run_bfs(start, goal)

@router.post("/dfs", response_model=AlgorithmResultOut)
def run_dfs(req: AlgorithmRunRequest):
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    return search_engine.run_dfs(start, goal)

@router.post("/hill-climbing", response_model=AlgorithmResultOut)
def run_hill_climbing(req: AlgorithmRunRequest):
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    return search_engine.run_hill_climbing(start, goal)

@router.post("/branch-and-bound", response_model=AlgorithmResultOut)
def run_branch_and_bound(req: AlgorithmRunRequest):
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    return search_engine.run_branch_and_bound(start, goal, budget=req.budget or 600.0)

@router.post("/dijkstra", response_model=AlgorithmResultOut)
def run_dijkstra(req: AlgorithmRunRequest):
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    return search_engine.run_dijkstra(start, goal)

@router.post("/astar", response_model=AlgorithmResultOut)
def run_astar(req: AlgorithmRunRequest):
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    return search_engine.run_astar(start, goal)

@router.post("/optimal")
def get_optimal_pathway(req: AlgorithmRunRequest):
    """
    Production Pathway Optimizer:
    Computes the provably cost-optimal learning pathway using heuristic search.
    """
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    return search_engine.find_optimal_path(start, goal, budget=req.budget or 600.0)

@router.post("/compare")
def compare_all(req: AlgorithmRunRequest):
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    return search_engine.compare_all(start, goal, budget=req.budget or 600.0)

@router.post("/run", response_model=AlgorithmResultOut)
def run_unified(req: AlgorithmRunRequest):
    algo = (req.algorithm or "astar").lower().replace("-", "_")
    start = req.start_skill or "python"
    goal = req.target_career.lower().replace(" ", "_")
    if goal not in search_engine.graph.nodes:
        goal = "data_scientist"
    
    if algo == "bfs":
        return search_engine.run_bfs(start, goal)
    elif algo == "dfs":
        return search_engine.run_dfs(start, goal)
    elif algo == "hill_climbing":
        return search_engine.run_hill_climbing(start, goal)
    elif algo in ("branch_and_bound", "branch_bound"):
        return search_engine.run_branch_and_bound(start, goal, budget=req.budget or 600.0)
    elif algo == "dijkstra":
        return search_engine.run_dijkstra(start, goal)
    else:
        return search_engine.run_astar(start, goal)


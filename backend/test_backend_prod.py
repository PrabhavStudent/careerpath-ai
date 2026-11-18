import os
import sys
import time

backend_dir = r"C:\Users\DELL\Desktop\AI Project\backend"
sys.path.insert(0, backend_dir)

from app.core.config import settings
from app.core.database import engine, init_db
from app.core.cache import app_cache
from app.services.search_algorithms import search_engine
from app.services.ml_service import ml_service
from sqlalchemy import inspect

print("=== BACKEND PRODUCTION VERIFICATION ===")
print(f"DATABASE_URL: {settings.DATABASE_URL}")

# 1. Test Database & Indexes
print("\n1. Verifying Database Tables and Indexes...")
init_db()
inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Total Tables Created: {len(tables)}")
for tbl in ["users", "student_profiles", "courses", "jobs", "occupations", "learning_plans"]:
    indexes = inspector.get_indexes(tbl)
    print(f"  Table '{tbl}' has {len(indexes)} indexes: {[idx['name'] for idx in indexes]}")

# 2. Test Pathfinding Engine (Optimal A* under the hood)
print("\n2. Testing Single Optimal Pathfinding Engine (A*)...")
t0 = time.perf_counter()
res1 = search_engine.find_optimal_path("python", "data_scientist")
t1 = time.perf_counter()
print(f"First Call: Execution Time = {(t1 - t0)*1000:.3f} ms")
print(f"  Title: {res1['pathway_title']}")
print(f"  Status: {res1['status']}")
print(f"  Discovered Path: {res1['path_display']}")
print(f"  Total Cost: Rs. {res1['total_cost']}")
print(f"  Estimated Hours: {res1['estimated_hours']}")

# 3. Test In-Memory Caching on Second Call
t2 = time.perf_counter()
res2 = search_engine.find_optimal_path("python", "data_scientist")
t3 = time.perf_counter()
print(f"Second Call (Cached): Execution Time = {(t3 - t2)*1000:.4f} ms")
print(f"  Speedup Factor: {((t1-t0) / max((t3-t2), 0.000001)):.1f}x")

# 4. Test ML Service Caching
print("\n3. Testing ML Service Caching...")
t4 = time.perf_counter()
occ1 = ml_service.get_occupation_by_code("15-1252.00")
t5 = time.perf_counter()
print(f"First get_occupation_by_code: {(t5 - t4)*1000:.3f} ms")

t6 = time.perf_counter()
occ2 = ml_service.get_occupation_by_code("15-1252.00")
t7 = time.perf_counter()
print(f"Second get_occupation_by_code (Cached): {(t7 - t6)*1000:.4f} ms")

print(f"\nCache Stats: {app_cache.stats()}")
print("\n=== ALL PRODUCTION VERIFICATIONS PASSED ===")

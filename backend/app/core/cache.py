import time
import functools
import hashlib
import json
import logging
from typing import Any, Optional, Dict, Tuple
from threading import RLock

logger = logging.getLogger("careerpath.cache")

class InMemoryTTLCache:
    """
    High-performance, thread-safe in-memory cache with TTL (Time-To-Live) expiration.
    Used in production to accelerate recommendation queries, O*NET lookups, and graph pathfinding.
    """
    def __init__(self, maxsize: int = 2000, default_ttl: int = 300):
        self._cache: Dict[str, Tuple[Any, float]] = {}
        self._maxsize = maxsize
        self._default_ttl = default_ttl
        self._lock = RLock()

    def _purge_expired(self):
        """Purges expired cache entries when cache size exceeds threshold."""
        now = time.time()
        expired_keys = [k for k, (_, exp) in self._cache.items() if now > exp]
        for k in expired_keys:
            self._cache.pop(k, None)

    def get(self, key: str) -> Optional[Any]:
        with self._lock:
            if key not in self._cache:
                return None
            val, exp = self._cache[key]
            if time.time() > exp:
                del self._cache[key]
                return None
            return val

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        with self._lock:
            if len(self._cache) >= self._maxsize:
                self._purge_expired()
                if len(self._cache) >= self._maxsize:
                    # Evict oldest entry
                    oldest_key = next(iter(self._cache))
                    del self._cache[oldest_key]
            
            duration = ttl if ttl is not None else self._default_ttl
            self._cache[key] = (value, time.time() + duration)

    def delete(self, key: str) -> bool:
        with self._lock:
            return self._cache.pop(key, None) is not None

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()

    def stats(self) -> Dict[str, Any]:
        with self._lock:
            now = time.time()
            active_count = sum(1 for _, exp in self._cache.values() if exp >= now)
            return {
                "total_entries": len(self._cache),
                "active_entries": active_count,
                "max_size": self._maxsize
            }

# Global Application Cache Instance
app_cache = InMemoryTTLCache(maxsize=3000, default_ttl=300)

def cached(ttl: int = 300, key_prefix: str = ""):
    """
    Function decorator for deterministic caching based on argument hashing.
    """
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                # Build deterministic cache key
                raw_key = f"{key_prefix}:{func.__module__}:{func.__name__}:{str(args)}:{str(sorted(kwargs.items()))}"
                hashed_key = hashlib.sha256(raw_key.encode('utf-8')).hexdigest()
            except Exception:
                return func(*args, **kwargs)

            hit = app_cache.get(hashed_key)
            if hit is not None:
                return hit

            result = func(*args, **kwargs)
            app_cache.set(hashed_key, result, ttl=ttl)
            return result
        return wrapper
    return decorator

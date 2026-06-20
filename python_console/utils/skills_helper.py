def add_skills(*skills: str) -> str:
    cleaned = [s.strip() for s in skills if s and s.strip()]
    return ", ".join(cleaned)

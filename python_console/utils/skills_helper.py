from utils.logger import get_logger

logger = get_logger(__name__)


def add_skills(*skills: str) -> str:
    cleaned = [s.strip() for s in skills if s and s.strip()]
    logger.info("Skills normalized: input_count=%s output_count=%s", len(skills), len(cleaned))
    return ", ".join(cleaned)

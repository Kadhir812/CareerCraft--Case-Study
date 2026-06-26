from menus.menu import main_menu
from utils.logger import get_logger

logger = get_logger(__name__)

if __name__ == "__main__":
    logger.info("CareerCrafter console application started")
    main_menu()

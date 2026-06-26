from dto.login_dto import LoginDTO
from dto.register_dto import RegisterDTO
from service.auth_service import AuthService
from utils.auth_helper import validate_email
from utils.constants import ROLE_EMPLOYER, ROLE_JOBSEEKER, VALID_ROLES
from exceptions.custom_exceptions import InvalidEmailException, AuthenticationFailedException
from utils.logger import get_logger

from menus.jobseeker_menu import jobseeker_menu
from menus.employer_menu import employer_menu

logger = get_logger(__name__)


def display_welcome_menu():
    print("""
    Welcome to CareerCrafter Console Application!
    Please select an option:
    1. Register
    2. Login
    3. Exit
    """)


def register_flow(auth_service: AuthService):
    try:
        logger.info("Registration flow started")
        name = input("Enter your name: ").strip()
        email = input("Enter your email: ").strip()
        validate_email(email)
        password = input("Enter your password: ").strip()
        role_input = input(f"Enter role ({ROLE_EMPLOYER}/{ROLE_JOBSEEKER}): ").strip().upper()
        
        if role_input not in VALID_ROLES:
            raise ValueError("Invalid role selected.")
        company_name = None
        
        if role_input == ROLE_EMPLOYER:
            company_name = input("Enter company name: ").strip()
            if not company_name:
                raise ValueError("Company name is required for employers.")
        
        dto = RegisterDTO(name, email, password, role_input, company_name)
        user = auth_service.register(dto)
        logger.info("User registered successfully: user_id=%s role=%s email=%s", user.user_id, role_input, email)
        
        print("\nRegistration successful! You can now login.")
    except InvalidEmailException as ie:
        logger.warning("Registration failed because email is invalid")
        print(f"Invalid email: {ie}")
    except Exception as e:
        logger.exception("Registration failed")
        print(f"Registration error: {e}")


def login_flow(auth_service: AuthService):
    """Handle user login and return JWT payload if successful."""
    try:
        logger.info("Login flow started")
        email = input("Enter your email: ").strip()
        password = input("Enter your password: ").strip()
        
        dto = LoginDTO(email, password)
        token = auth_service.login(dto)
        
        if token:
            print("\nLogin Success")
            print("JWT Token:")
            print(token)
            payload = auth_service.validate(token)
            if payload:
                logger.info("Login successful: user_id=%s role=%s email=%s", payload.get("user_id"), payload.get("role"), email)
            return payload
    
    except AuthenticationFailedException as af:
        logger.warning("Authentication failed")
        print(f"Authentication failed: {af}")
    except Exception as e:
        logger.exception("Login failed")
        print(f"Login error: {e}")
    return None


def main_menu():
    auth_service = AuthService()
    while True:
        display_welcome_menu()
        choice = input("Enter choice (1-3): ").strip()
        logger.info("Main menu choice selected: choice=%s", choice)
        if choice == "1":
            register_flow(auth_service)
        elif choice == "2":
            payload = login_flow(auth_service)
            if payload:
                print("You are now logged in. Token stored in memory.")
                role = payload.get("role")
                if role == ROLE_JOBSEEKER:
                    logger.info("Routing user to jobseeker menu: user_id=%s", payload.get("user_id"))
                    jobseeker_menu(payload)
                elif role == ROLE_EMPLOYER:
                    logger.info("Routing user to employer menu: user_id=%s", payload.get("user_id"))
                    employer_menu(payload)
                else:
                    logger.warning("Unknown role in token payload: role=%s", role)
                    print("Unknown role. Returning to main menu.")
        elif choice == "3":
            logger.info("Application exited from main menu")
            print("Goodbye!")
            break
        else:
            logger.warning("Invalid main menu selection: choice=%s", choice)
            print("Invalid selection. Please try again.")

# these are the logging levels provided by logger
# DEBUG
# INFO
# WARNING
# ERROR
# CRITICAL

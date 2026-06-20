import json
from auth.auth_controller import AuthController
from model.user import User
from utils.auth_helper import validate_email
from exceptions.custom_exceptions import InvalidEmailException, AuthenticationFailedException

from menus.jobseeker_menu import jobseeker_menu
from menus.employer_menu import employer_menu


def display_welcome_menu():
    print("""
    Welcome to CareerCrafter Console Application!
    Please select an option:
    1. Register
    2. Login
    3. Exit
    """)


def register_flow(controller: AuthController):
    """Handle user registration."""
    try:
        name = input("Enter your name: ").strip()
        email = input("Enter your email: ").strip()
        validate_email(email)
        password = input("Enter your password: ").strip()
        role_input = input("Enter role (EMPLOYER/JOBSEEKER): ").strip().upper()
        if role_input not in ("EMPLOYER", "JOBSEEKER"):
            raise ValueError("Invalid role selected.")
        user = User(None, name, email, password, role_input)
        controller.register(user)
    except InvalidEmailException as ie:
        print(f"Invalid email: {ie}")
    except Exception as e:
        print(f"Registration error: {e}")


def login_flow(controller: AuthController):
    """Handle user login and return JWT payload if successful."""
    try:
        email = input("Enter your email: ").strip()
        password = input("Enter your password: ").strip()
        user = User(None, None, email, password, None)
        token = controller.login(user)
        if token:
            # Decode payload without verification for role extraction (simple parsing)
            try:
                # jwt.encode returns a string; split by '.' and decode payload
                payload_part = token.split('.')[1]
                # Pad base64 if needed
                import base64
                padded = payload_part + '=' * (-len(payload_part) % 4)
                payload_bytes = base64.urlsafe_b64decode(padded)
                payload = json.loads(payload_bytes)
                return payload
            except Exception:
                return None
    except AuthenticationFailedException as af:
        print(f"Authentication failed: {af}")
    except Exception as e:
        print(f"Login error: {e}")
    return None


def main_menu():
    controller = AuthController()
    while True:
        display_welcome_menu()
        choice = input("Enter choice (1-3): ").strip()
        if choice == "1":
            register_flow(controller)
        elif choice == "2":
            payload = login_flow(controller)
            if payload:
                print("You are now logged in. Token stored in memory.")
                role = payload.get("role")
                if role == "JOBSEEKER":
                    jobseeker_menu(controller, payload)
                elif role == "EMPLOYER":
                    employer_menu(controller, payload)
                else:
                    print("Unknown role. Returning to main menu.")
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("Invalid selection. Please try again.")

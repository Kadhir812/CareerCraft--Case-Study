from auth.auth_service import AuthService


class AuthController:

    def __init__(self):
        self.auth_service = AuthService()

    def register(self,user):

        try:

            self.auth_service.register(user)

        except Exception as e:

            print(e)
class RegisterDTO:

    def __init__(self, name: str, email: str, password: str, role: str, company_name: str | None = None):
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.company_name = company_name

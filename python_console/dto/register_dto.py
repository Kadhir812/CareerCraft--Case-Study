class RegisterDTO:

    def __init__(self, name, email, password, role, company_name=None):
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.company_name = company_name

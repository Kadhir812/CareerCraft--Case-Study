class User:

    def __init__(self, user_id, name, email, password, role, company_name=None):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.company_name = company_name

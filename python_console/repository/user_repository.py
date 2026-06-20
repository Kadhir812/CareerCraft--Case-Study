from utils.db_connection import get_connection


class UserRepository:

    def save(self,user):
        conn = None
        cursor = None
        try:
            conn = get_connection()
            cursor = conn.cursor()
            query = """
            INSERT INTO users(name,email,password,role)
            VALUES(%s,%s,%s,%s)
            """
            
            values = (
                user.name,
                user.email,
                user.password,
                user.role
            )

            cursor.execute(query, values)
            conn.commit()
            print("User Registered Successfully")

        except Exception as e:
            print(e)

        finally:

            if cursor:
                cursor.close()

            if conn:
                conn.close()

    def find_by_email(self, email):
        conn = None
        cursor = None
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM users WHERE email = %s"
            cursor.execute(query, (email,))
            result = cursor.fetchone()
            if result:
                from model.user import User
                return User(result['user_id'], result['name'], result['email'], result['password'], result['role'])
            return None
        except Exception as e:
            print(e)
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
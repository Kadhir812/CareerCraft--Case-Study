from utils.db_connection import get_connection
from model.profile import Profile

class ProfileRepository:
    def save(self, profile: Profile):
        conn = None
        cursor = None
        try:
            conn = get_connection()
            cursor = conn.cursor()
            query = """
                INSERT INTO profiles (user_id, qualification, experience, skills)
                VALUES (%s, %s, %s, %s)
            """
            values = (
                profile.user_id,
                profile.qualification,
                profile.experience,
                profile.skills,
            )
            cursor.execute(query, values)
            conn.commit()
            print("Profile created successfully.")
        except Exception as e:
            print(f"Error creating profile: {e}")
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

    def find_by_user_id(self, user_id: int) -> Profile | None:
        conn = None
        cursor = None
        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            query = "SELECT * FROM profiles WHERE user_id = %s"
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()
            if result:
                return Profile(
                    result["profile_id"],
                    result["user_id"],
                    result["qualification"],
                    result["experience"],
                    result["skills"],
                )
            return None
        except Exception as e:
            print(f"Error fetching profile: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

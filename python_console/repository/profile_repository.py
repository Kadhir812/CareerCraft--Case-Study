from model.profile import Profile
from utils.db_context import db_cursor
from utils.logger import get_logger

logger = get_logger(__name__)

class ProfileRepository:
    def save(self, profile):
        try:
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
            with db_cursor(commit=True) as cursor:
                cursor.execute(query, values)
            logger.info("Profile saved: user_id=%s", profile.user_id)
        except Exception as e:
            logger.exception("Error creating profile: user_id=%s", profile.user_id)
            print(f"Error creating profile: {e}")

    def find_by_user_id(self, user_id):
        try:
            query = "SELECT * FROM profiles WHERE user_id = %s"
            with db_cursor(dictionary=True) as cursor:
                cursor.execute(query, (user_id,))
                result = cursor.fetchone()
            if result:
                logger.info("Profile found by user: user_id=%s", user_id)
                return Profile(
                    result["profile_id"],
                    result["user_id"],
                    result["qualification"],
                    result["experience"],
                    result["skills"],
                )
            logger.info("No profile found by user: user_id=%s", user_id)
            return None
        except Exception as e:
            logger.exception("Error fetching profile: user_id=%s", user_id)
            print(f"Error fetching profile: {e}")
            return None

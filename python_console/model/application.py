from utils.constants import STATUS_APPLIED


class Application:

    def __init__(
        self,
        application_id,
        job_id,
        user_id,
        resume_id,
        phone_number,
        status=STATUS_APPLIED
    ):
        self.application_id = application_id
        self.job_id = job_id
        self.user_id = user_id
        self.resume_id = resume_id
        self.phone_number = phone_number
        self.status = status

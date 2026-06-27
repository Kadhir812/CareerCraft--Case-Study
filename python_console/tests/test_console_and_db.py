import pytest

from dto.login_dto import LoginDTO
from dto.job_dto import JobDTO
from dto.profile_dto import ProfileDTO
from dto.register_dto import RegisterDTO
from model.user import User


@pytest.fixture
def register_values():
    return {
        "name": "Asha Sharma",
        "email": "asha@example.com",
        "password": "StrongPass123",
        "role": "JOBSEEKER",
        "company_name": None,
    }


def test_register_dto_sets_values(register_values):
    dto = RegisterDTO(**register_values)

    assert dto.name == register_values["name"]
    assert dto.email == register_values["email"]
    assert dto.password == register_values["password"]
    assert dto.role == register_values["role"]
    assert dto.company_name == register_values["company_name"]


@pytest.mark.parametrize(
    "email,password,expected_email,expected_password",
    [
        ("candidate@example.com", "candidate123", "candidate@example.com", "candidate123"),
        ("employer@example.com", "employer123", "employer@example.com", "employer123"),
    ],
)
def test_login_dto_sets_values(email, password, expected_email, expected_password):
    dto = LoginDTO(email=email, password=password)

    assert dto.email == expected_email
    assert dto.password == expected_password


@pytest.mark.parametrize(
    "user_id,name,email,password,role,company_name,expected",
    [
        (1, "Ravi Kumar", "ravi@example.com", "pass123", "JOBSEEKER", None, "Ravi Kumar"),
        (2, "Tech Corp", "hr@techcorp.com", "pass456", "EMPLOYER", "Tech Corp", "Tech Corp"),
    ],
)
def test_user_sets_values(user_id, name, email, password, role, company_name, expected):
    user = User(user_id, name, email, password, role, company_name)

    assert user.user_id == user_id
    assert user.name == expected
    assert user.email == email
    assert user.password == password
    assert user.role == role
    assert user.company_name == company_name


@pytest.mark.parametrize(
    "title,description,location,salary,required_skills,expected_salary",
    [
        ("Python Developer", "Build backend APIs", "Bengaluru", 750000.0, "Python, SQL", 750000.0),
        ("React Developer", "Build UI pages", "Remote", 650000.0, "React, CSS", 650000.0),
    ],
)
def test_job_dto_sets_values(
    title,
    description,
    location,
    salary,
    required_skills,
    expected_salary,
):
    dto = JobDTO(title, description, location, salary, required_skills)

    assert dto.title == title
    assert dto.description == description
    assert dto.location == location
    assert dto.salary == expected_salary
    assert dto.required_skills == required_skills


@pytest.mark.parametrize(
    "qualification,experience,skills,expected_experience",
    [
        ("B.Tech", 2, "Python, MySQL", 2),
        ("MBA", 5, "Hiring, Communication", 5),
    ],
)
def test_profile_dto_sets_values(qualification, experience, skills, expected_experience):
    dto = ProfileDTO(qualification, experience, skills)

    assert dto.qualification == qualification
    assert dto.experience == expected_experience
    assert dto.skills == skills

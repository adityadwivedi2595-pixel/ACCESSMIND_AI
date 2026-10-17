from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
from app.main import app
from app.models.scheme import Scheme


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        with TestingSessionLocal() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestingSessionLocal() as db:
        db.add(
            Scheme(
                name="Test scheme",
                category="Education",
                description="Test description",
                criteria=[],
            )
        )
        db.commit()

    yield TestClient(app)

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


def test_profiles_are_isolated_by_private_session_id(client):
    owner_session = str(uuid4())
    other_session = str(uuid4())

    response = client.post(
        "/api/v1/profiles/",
        json={"session_id": owner_session, "name": "Private profile", "income": 12345},
    )
    assert response.status_code == 200

    owner_profile = client.get(f"/api/v1/profiles/{owner_session}")
    other_profile = client.get(f"/api/v1/profiles/{other_session}")
    assert owner_profile.json()["name"] == "Private profile"
    assert other_profile.json()["name"] is None


def test_saved_scheme_cannot_be_deleted_by_another_session(client):
    owner_session = str(uuid4())
    other_session = str(uuid4())
    saved = client.post(
        "/api/v1/checklist/saved",
        json={"session_id": owner_session, "scheme_id": 1},
    )
    assert saved.status_code == 200

    forbidden_delete = client.delete(
        f"/api/v1/checklist/saved/{saved.json()['id']}",
        params={"session_id": other_session},
    )
    assert forbidden_delete.status_code == 404
    assert len(client.get(f"/api/v1/checklist/saved/{owner_session}").json()) == 1


def test_checklist_tasks_cannot_be_changed_by_another_session(client):
    owner_session = str(uuid4())
    other_session = str(uuid4())
    task = client.post(
        "/api/v1/checklist/tasks",
        json={
            "session_id": owner_session,
            "scheme_id": 1,
            "task_text": "Private task",
        },
    )
    assert task.status_code == 200
    task_id = task.json()["id"]

    update = client.put(
        f"/api/v1/checklist/tasks/{task_id}",
        params={"session_id": other_session},
        json={"is_completed": True},
    )
    delete = client.delete(
        f"/api/v1/checklist/tasks/{task_id}",
        params={"session_id": other_session},
    )
    assert update.status_code == 404
    assert delete.status_code == 404

    owner_tasks = client.get(f"/api/v1/checklist/tasks/{owner_session}")
    assert owner_tasks.json()[0]["is_completed"] is False


def test_legacy_shared_session_id_is_rejected(client):
    response = client.get("/api/v1/profiles/default_user")
    assert response.status_code == 422

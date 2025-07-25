import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

import app.main as main
from app.sop_loader import load_sop
from app.storage import JSONStorage

@pytest.fixture
def client(tmp_path, monkeypatch):
    sop_file = Path(__file__).resolve().parents[1] / "sop.xml"
    steps = load_sop(sop_file)
    monkeypatch.setattr(main, "steps", steps)

    responses_file = tmp_path / "responses.json"
    responses_file.write_text("[]")
    storage = JSONStorage(responses_file)
    monkeypatch.setattr(main, "storage", storage)

    with TestClient(main.app) as c:
        yield c, responses_file

def test_start_endpoint(client):
    c, _ = client
    resp = c.get("/sop/start")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_step"]["id"] == "1"
    assert data["current_step"]["description"] == "Enter your name"

def test_get_step_endpoint(client):
    c, _ = client
    resp = c.get("/sop/step/2")
    assert resp.status_code == 200
    data = resp.json()
    assert data["step"]["id"] == "2"
    assert data["step"]["description"] == "Enter your email"

def test_post_step_updates_file(client):
    c, path = client
    r1 = c.post("/sop/step/1", json={"name": "Bob"})
    assert r1.status_code == 200
    assert r1.json()["next_step"]["id"] == "2"

    saved = json.loads(path.read_text())
    assert len(saved) == 1
    assert saved[0]["step_id"] == "1"
    assert saved[0]["data"] == {"name": "Bob"}

    r2 = c.post("/sop/step/2", json={"email": "bob@example.com"})
    assert r2.status_code == 200
    assert r2.json() == {"detail": "SOP completed"}

    saved = json.loads(path.read_text())
    assert len(saved) == 2
    assert saved[1]["step_id"] == "2"
    assert saved[1]["data"] == {"email": "bob@example.com"}

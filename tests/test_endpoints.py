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

def test_start_returns_first_step(client):
    c, _ = client
    resp = c.get("/sop/start")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_step"]["id"] == "1"


def test_post_step_advances_and_records(client):
    c, path = client
    resp = c.post("/sop/step/1", json={"name": "Alice"})
    assert resp.status_code == 200
    assert resp.json()["next_step"]["id"] == "2"

    saved = json.loads(path.read_text())
    assert len(saved) == 1
    assert saved[0]["step_id"] == "1"
    assert saved[0]["data"] == {"name": "Alice"}

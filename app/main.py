from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from .sop_loader import load_sop
from .storage import JSONStorage
from .models import Step

SOP_FILE = Path("sop.xml")
DATA_FILE = Path("responses.json")

app = FastAPI(title="SOP Runner")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

steps = load_sop(SOP_FILE)
storage = JSONStorage(DATA_FILE)

@app.get("/sop/start")
def start_sop() -> Dict:
    if not steps:
        raise HTTPException(status_code=404, detail="No steps available")
    return {"current_step": steps[0]}

@app.get("/sop/step/{step_id}")
def get_step(step_id: str) -> Dict:
    for step in steps:
        if step.id == step_id:
            return {"step": step}
    raise HTTPException(status_code=404, detail="Step not found")

@app.post("/sop/step/{step_id}")
def submit_step(step_id: str, data: Dict[str, str]):
    for idx, step in enumerate(steps):
        if step.id == step_id:
            storage.append(storage.new_response(step_id, data))
            next_index = idx + 1
            if next_index < len(steps):
                return {"next_step": steps[next_index]}
            else:
                return {"detail": "SOP completed"}
    raise HTTPException(status_code=404, detail="Step not found")


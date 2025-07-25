from pydantic import BaseModel
from typing import List, Optional

class StepInput(BaseModel):
    name: str
    prompt: str
    type: str = "text"

class Step(BaseModel):
    id: str
    description: str
    inputs: List[StepInput] = []

class StepResponse(BaseModel):
    step_id: str
    timestamp: str
    data: dict

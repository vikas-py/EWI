from pydantic import BaseModel, Field
from typing import List, Optional

class StepInput(BaseModel):
    name: str
    prompt: str
    type: str = "text"

class Step(BaseModel):
    id: str
    description: str
    inputs: List[StepInput] = Field(default_factory=list)

class StepResponse(BaseModel):
    step_id: str
    timestamp: str
    data: dict

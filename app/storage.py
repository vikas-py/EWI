from pathlib import Path
import json
from datetime import datetime
from .models import StepResponse

class JSONStorage:
    def __init__(self, path: Path):
        self.path = path
        if not self.path.exists():
            self.path.write_text("[]")

    def append(self, response: StepResponse):
        data = json.loads(self.path.read_text())
        data.append(response.dict())
        self.path.write_text(json.dumps(data, indent=2))

    def new_response(self, step_id: str, data: dict) -> StepResponse:
        return StepResponse(
            step_id=step_id,
            timestamp=datetime.utcnow().isoformat(),
            data=data,
        )

import xml.etree.ElementTree as ET
from pathlib import Path
from .models import Step, StepInput
from typing import List

def load_sop(xml_path: Path) -> List[Step]:
    tree = ET.parse(xml_path)
    root = tree.getroot()
    steps = []
    for step_el in root.findall("step"):
        step_id = step_el.get("id") or str(len(steps) + 1)
        description = step_el.findtext("description", default="")
        inputs_el = step_el.find("inputs")
        inputs = []
        if inputs_el is not None:
            for input_el in inputs_el.findall("input"):
                inputs.append(
                    StepInput(
                        name=input_el.get("name"),
                        prompt=input_el.findtext("prompt", default=""),
                        type=input_el.get("type", "text"),
                    )
                )
        steps.append(Step(id=step_id, description=description, inputs=inputs))
    return steps

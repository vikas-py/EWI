from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.sop_loader import load_sop


def test_load_sop_reads_id_element(tmp_path: Path):
    xml = tmp_path / "sop.xml"
    xml.write_text(
        """
<sop>
    <step>
        <id>1</id>
        <description>Desc</description>
    </step>
</sop>
"""
    )
    steps = load_sop(xml)
    assert len(steps) == 1
    assert steps[0].id == "1"
    assert steps[0].description == "Desc"

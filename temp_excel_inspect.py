import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

path = Path("requirements-excel-file/epic-Project-Session-creation.xlsx")
if not path.exists():
    raise SystemExit(f"file not found: {path}")

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"

def column_index(cell_ref: str) -> int:
    letters = "".join(ch for ch in cell_ref if ch.isalpha())
    result = 0
    for ch in letters:
        result = result * 26 + (ord(ch.upper()) - ord("A") + 1)
    return result - 1

def parse_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    strings = []
    for si in root.findall(f"{NS}si"):
        texts = []
        for t in si.findall(f".//{NS}t"):
            texts.append(t.text or "")
        strings.append("".join(texts))
    return strings

def parse_sheet(zf: zipfile.ZipFile, sheet_path: str, shared_strings: list[str]) -> list[list[str]]:
    raw = zf.read(f"xl/{sheet_path}")
    root = ET.fromstring(raw)
    rows = []
    for row_elem in root.findall(f".//{NS}row"):
        values = {}
        max_idx = -1
        for cell in row_elem.findall(f"{NS}c"):
            ref = cell.attrib.get("r")
            if not ref:
                continue
            idx = column_index(ref)
            max_idx = max(max_idx, idx)
            value = ""
            cell_type = cell.attrib.get("t")
            v = cell.find(f"{NS}v")
            if v is not None and v.text is not None:
                raw_value = v.text
                if cell_type == "s":
                    try:
                        value = shared_strings[int(raw_value)]
                    except (ValueError, IndexError):
                        value = raw_value
                else:
                    value = raw_value
            elif cell_type == "inlineStr":
                is_elem = cell.find(f"{NS}is")
                if is_elem is not None:
                    texts = []
                    for t in is_elem.findall(f".//{NS}t"):
                        texts.append(t.text or "")
                    value = "".join(texts)
            values[idx] = value
        if max_idx >= 0:
            row_list = [values.get(i, "") for i in range(max_idx + 1)]
        else:
            row_list = []
        rows.append(row_list)
    return rows

def sheet_name_map(zf: zipfile.ZipFile) -> list[tuple[str, str]]:
    wb_root = ET.fromstring(zf.read("xl/workbook.xml"))
    rel_root = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    rel_map = {}
    for rel in rel_root.findall(f".//{{http://schemas.openxmlformats.org/package/2006/relationships}}Relationship"):
        rid = rel.attrib.get("Id")
        target = rel.attrib.get("Target")
        if rid and target:
            rel_map[rid] = target
    result = []
    for sheet in wb_root.findall(f".//{NS}sheet"):
        name = sheet.attrib.get("name")
        rid = sheet.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        target = rel_map.get(rid, "")
        if target.startswith("../"):
            target = target.split("../", 1)[1]
        result.append((name or "?", target))
    return result

with zipfile.ZipFile(path) as zf:
    shared_strings = parse_shared_strings(zf)
    sheets = sheet_name_map(zf)
    print("SHEET_NAMES:", [name for name, _ in sheets])
    for sheet_name, rel_target in sheets:
        print("SHEET:", sheet_name)
        rows = parse_sheet(zf, rel_target, shared_strings)
        if not rows:
            print("  (empty)")
            continue
        header = rows[0]
        print("  HEADER:", header)
        print("  TOTAL_ROWS:", len(rows) - 1)
        for idx, row in enumerate(rows[:6]):
            print("    ROW", idx, row)
        flow_columns = [idx for idx, value in enumerate(header) if value and "Flow" in value]
        if not flow_columns:
            flow_columns = [0]
        for row in rows[1:]:
            if not any(cell for cell in row):
                continue
            flow_values = [row[idx] for idx in flow_columns if idx < len(row)]
            if any(str(flow).strip() in {"Epic Flow", "Project Flow", "Session Creation Flow"} for flow in flow_values if flow):
                print("  ROW:", row)

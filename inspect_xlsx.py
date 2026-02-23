import zipfile, xml.etree.ElementTree as ET 
from pathlib import Path 
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}' 
path = Path('requirements-excel-file/epic-Project-Session-creation.xlsx') 
if not path.exists(): 
    raise SystemExit('missing workbook') 
with zipfile.ZipFile(path) as zf: 
    shared = [] 
    if 'xl/sharedStrings.xml' in zf.namelist(): 
        sroot = ET.fromstring(zf.read('xl/sharedStrings.xml')) 
        for si in sroot.findall(f'{NS}si'): 
            texts = [t.text or '' for t in si.findall(f'.//{NS}t')] 
            shared.append(''.join(texts)) 
    relroot = ET.fromstring(zf.read('xl/_rels/workbook.xml.rels')) 
    rels = {rel.attrib['Id']: rel.attrib['Target'] for rel in relroot.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')} 
    wroot = ET.fromstring(zf.read('xl/workbook.xml')) 
    sheets = [] 
    for sheet in wroot.findall(f'.//{NS}sheet'): 
        name = sheet.attrib.get('name') 
        rid = sheet.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id') 
        target = rels.get(rid) 
        sheets.append((name, target)) 
    def col_idx(ref): 
        letters = ''.join(ch for ch in ref if ch.isalpha()) 
        idx = 0 
        for ch in letters: 
            idx = idx * 26 + (ord(ch.upper()) - ord('A') + 1) 
        return idx - 1 
    for name, target in sheets: 

import json 
p='temp_extract/all_testcases.json' 
data=json.load(open(p,encoding='utf-8')) 
cases=data['URS-DV-AN-13']['SRS-114'] 
print('COUNT',len(cases)) 
for c in cases: 

import json

with open('public/documents/ll-scroll.json', 'r') as f:
    data = json.load(f)

# The total path coordinates for line 1 and line 2
for a in data.get('assets', []):
    if 'layers' in a:
        for subl in a['layers']:
            print("Sublayer:", subl.get('nm'))
            for sh in subl.get('shapes', []):
                if sh.get('ty') == 'gr':
                    for it in sh.get('it', []):
                        if it.get('ty') == 'sh':
                            pts = it.get('ks', {}).get('k', {}).get('v', [])
                            print("  Total points in path:", len(pts))
                            print("  First 5 points:", pts[:5])

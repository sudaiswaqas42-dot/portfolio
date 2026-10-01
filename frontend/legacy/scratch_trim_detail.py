import json

with open('public/documents/ll-scroll.json', 'r') as f:
    data = json.load(f)

# check trim paths end keyframes
for a in data.get('assets', []):
    if 'layers' in a:
        for subl in a['layers']:
            print("Sublayer:", subl.get('nm'))
            for sh in subl.get('shapes', []):
                if sh.get('ty') == 'tm':
                    print("  Trim paths end:", sh.get('e'))

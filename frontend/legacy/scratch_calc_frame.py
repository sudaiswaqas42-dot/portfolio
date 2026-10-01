import json

with open('public/documents/ll-scroll.json', 'r') as f:
    data = json.load(f)

# Total length of line 1
pts = data['assets'][1]['layers'][1]['shapes'][0]['it'][0]['ks']['k']['v']
total_len = 0
import math
for i in range(len(pts)-1):
    dx = pts[i+1][0] - pts[i][0]
    dy = pts[i+1][1] - pts[i][1]
    d = math.hypot(dx, dy)
    total_len += d
    print(f"Segment {i}: length = {d:.1f}, cumulative = {total_len:.1f}")

seg0_len = math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1])
seg0_pct = (seg0_len / total_len) * 100
print(f"Segment 0 is {seg0_pct:.2f}% of total path")

# Check keyframes for trim paths end
e_k = data['assets'][1]['layers'][1]['shapes'][1]['e']['k']
print("Trim path end keyframes:", e_k)

from PIL import Image

img = Image.open('scratch/ll_image0.png')
pixels = img.load()
w, h = img.size

print("Inspecting x of lines from y = 0 to 500:")
for y in range(0, 500, 25):
    l1 = [x for x in range(2050, 2110) if pixels[x, y][3] > 50]
    l2 = [x for x in range(2110, 2160) if pixels[x, y][3] > 50]
    c1 = sum(l1)/len(l1) if l1 else None
    c2 = sum(l2)/len(l2) if l2 else None
    print(f"y={y}: line1 center={c1}, line2 center={c2}")

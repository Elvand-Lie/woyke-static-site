from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


source = Path(__file__).parent / "brief"
files = sorted(source.glob("page-*.png"))
thumb_size = (300, 388)
columns = 4
rows = 2
gap = 16
label_height = 32

for sheet_number, offset in enumerate(range(0, len(files), columns * rows), start=1):
    subset = files[offset : offset + columns * rows]
    canvas = Image.new(
        "RGB",
        (
            columns * thumb_size[0] + (columns - 1) * gap,
            rows * (thumb_size[1] + label_height) + (rows - 1) * gap,
        ),
        "white",
    )
    draw = ImageDraw.Draw(canvas)
    for index, path in enumerate(subset):
        x = (index % columns) * (thumb_size[0] + gap)
        y = (index // columns) * (thumb_size[1] + label_height + gap)
        with Image.open(path) as page:
            thumb = ImageOps.contain(page.convert("RGB"), thumb_size)
        canvas.paste(thumb, (x, y))
        draw.text((x + 4, y + thumb_size[1] + 6), path.name, fill="black")
    canvas.save(source / f"contact-{sheet_number}.jpg", quality=88)

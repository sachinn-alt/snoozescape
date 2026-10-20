import math
from PIL import Image, ImageDraw

def create_sloth_icon(size):
    img = Image.new("RGBA", (size, size), (7, 8, 15, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer glow / halo
    center = size / 2
    r_outer = size * 0.44
    draw.ellipse(
        [center - r_outer, center - r_outer, center + r_outer, center + r_outer],
        fill=(18, 22, 40, 255),
        outline=(245, 183, 38, 200),
        width=max(2, int(size * 0.015))
    )
    
    # Crescent moon
    moon_r = size * 0.28
    moon_x = center - size * 0.02
    moon_y = center + size * 0.02
    draw.ellipse(
        [moon_x - moon_r, moon_y - moon_r, moon_x + moon_r, moon_y + moon_r],
        fill=(245, 183, 38, 255)
    )
    # Mask out inside of moon for crescent effect
    cut_r = size * 0.24
    cut_x = moon_x + size * 0.08
    cut_y = moon_y - size * 0.06
    draw.ellipse(
        [cut_x - cut_r, cut_y - cut_r, cut_x + cut_r, cut_y + cut_r],
        fill=(18, 22, 40, 255)
    )
    
    # Sleeping Sloth Body (Soft warm cream/tan)
    sloth_w = size * 0.24
    sloth_h = size * 0.18
    sloth_x = center - size * 0.08
    sloth_y = center - size * 0.06
    draw.ellipse(
        [sloth_x - sloth_w/2, sloth_y - sloth_h/2, sloth_x + sloth_w/2, sloth_y + sloth_h/2],
        fill=(217, 180, 143, 255)
    )
    
    # Sloth Face mask (dark brown eye stripes)
    face_w = size * 0.14
    face_h = size * 0.12
    draw.ellipse(
        [sloth_x - face_w/2, sloth_y - face_h/2, sloth_x + face_w/2, sloth_y + face_h/2],
        fill=(240, 225, 205, 255)
    )
    # Eye patches
    patch_w = size * 0.04
    patch_h = size * 0.025
    draw.ellipse(
        [sloth_x - size*0.045, sloth_y - size*0.015, sloth_x - size*0.005, sloth_y + patch_h],
        fill=(120, 85, 55, 255)
    )
    draw.ellipse(
        [sloth_x + size*0.005, sloth_y - size*0.015, sloth_x + size*0.045, sloth_y + patch_h],
        fill=(120, 85, 55, 255)
    )
    # Sleeping closed eyes (cute smile arcs)
    draw.arc([sloth_x - size*0.04, sloth_y - size*0.01, sloth_x - size*0.01, sloth_y + size*0.02], 0, 180, fill=(40, 25, 15, 255), width=max(1, int(size*0.012)))
    draw.arc([sloth_x + size*0.01, sloth_y - size*0.01, sloth_x + size*0.04, sloth_y + size*0.02], 0, 180, fill=(40, 25, 15, 255), width=max(1, int(size*0.012)))
    
    # Sleeping peaceful nose
    nose_x = sloth_x
    nose_y = sloth_y + size * 0.025
    draw.ellipse([nose_x - size*0.015, nose_y - size*0.01, nose_x + size*0.015, nose_y + size*0.01], fill=(50, 35, 20, 255))
    
    # Sloth cute curved sleeping claws hugging the moon
    claw_x = center + size * 0.08
    claw_y = center + size * 0.04
    draw.arc([claw_x - size*0.04, claw_y - size*0.04, claw_x + size*0.04, claw_y + size*0.04], 45, 220, fill=(180, 150, 120, 255), width=max(2, int(size*0.02)))
    
    # Twinkling Stars in background
    stars = [
        (center + size * 0.25, center - size * 0.22, size * 0.016),
        (center - size * 0.28, center - size * 0.18, size * 0.012),
        (center + size * 0.22, center + size * 0.22, size * 0.014),
        (center - size * 0.24, center + size * 0.24, size * 0.012),
        (center - size * 0.05, center - size * 0.32, size * 0.018),
    ]
    for sx, sy, sr in stars:
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(255, 255, 255, 230))
    
    # Add subtle 'Z z z' sleep marks
    draw.text((center + size * 0.16, center - size * 0.16), "z", fill=(245, 183, 38, 220))
    draw.text((center + size * 0.22, center - size * 0.24), "Z", fill=(245, 183, 38, 240))

    return img

icon192 = create_sloth_icon(192)
icon192.save(r"C:\Users\DELL\.gemini\antigravity-ide\scratch\snoozescape\icon-192.png", "PNG")

icon512 = create_sloth_icon(512)
icon512.save(r"C:\Users\DELL\.gemini\antigravity-ide\scratch\snoozescape\icon-512.png", "PNG")

print("Generated icon-192.png and icon-512.png successfully!")

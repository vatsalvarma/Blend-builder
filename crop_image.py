from PIL import Image
import os

img_path = 'public/vasavi_bg.png'
if os.path.exists(img_path):
    img = Image.open(img_path)
    width, height = img.size
    
    # Target aspect ratio 16:9
    target_aspect = 16.0 / 9.0
    current_aspect = width / height
    
    if current_aspect < target_aspect:
        # Crop top and bottom
        new_height = int(width / target_aspect)
        offset = (height - new_height) // 2
        img = img.crop((0, offset, width, height - offset))
    else:
        # Crop left and right
        new_width = int(height * target_aspect)
        offset = (width - new_width) // 2
        img = img.crop((offset, 0, width - offset, height))
        
    img.save('public/vasavi_bg_landscape.png')
    print('Image cropped to landscape and saved as vasavi_bg_landscape.png')
else:
    print('Image not found')

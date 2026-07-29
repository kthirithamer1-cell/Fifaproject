import os
from PIL import Image

def compress_folder(folder_path, quality=80):
    if not os.path.exists(folder_path):
        print(f"Folder not found: {folder_path}")
        return

    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                src_path = os.path.join(root, file)
                base_name = os.path.splitext(file)[0]
                webp_path = os.path.join(root, base_name + '.webp')
                
                original_size = os.path.getsize(src_path)
                try:
                    with Image.open(src_path) as img:
                        # Convert RGBA to RGB if needed for non-alpha JPEG, but WebP supports RGBA!
                        img.save(webp_path, 'WEBP', quality=quality, optimize=True)
                    
                    new_size = os.path.getsize(webp_path)
                    savings = (1 - (new_size / original_size)) * 100
                    print(f"Converted: {file} ({original_size/1024/1024:.2f} MB) -> {base_name}.webp ({new_size/1024/1024:.2f} MB) [{savings:.1f}% saved]")
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")

print("--- Compressing public/images ---")
compress_folder(r"c:\Users\MEDIA INFOPLUS\my-next-app\public\images")

print("\n--- Compressing public/prompting ---")
compress_folder(r"c:\Users\MEDIA INFOPLUS\my-next-app\public\prompting")

from PIL import Image
import os

from PIL import Image
import os

def cut_image_into_parts(image_path, n):
    # Extract the image file name without extension
    image_name = os.path.splitext(os.path.basename(image_path))[0]
    
    # Create the output folder structure
    root_folder = "ImageStorage"
    output_folder = os.path.join(root_folder, image_name)
    os.makedirs(output_folder, exist_ok=True)
    
    # Open the image
    img = Image.open(image_path)
    
    # Get image dimensions
    width, height = img.size
    
    # Calculate the height of each part
    part_height = height // n
    
    # Crop the image into n horizontal parts
    for i in range(n):
        # Define the bounding box for the current part
        top = i * part_height
        bottom = (i + 1) * part_height if i != n - 1 else height  # Handle the last part
        
        # Crop the image
        cropped_img = img.crop((0, top, width, bottom))
        
        # Save the cropped part in the specific folder
        cropped_img.save(os.path.join(output_folder, f"imgpart_{i + 1}.png"))
        # print(f"Saved part {i + 1} as imgpart_{i + 1}.png")
        
    # print(f"Image has been cut into {n} parts and saved in '{output_folder}'.")

# Example usage
# cut_image_into_parts('Example1.jpg', 4)
import cv2
from PIL import Image
from pytesseract import image_to_string
import os

def reader(image_folder_name):
    # Set the path to the folder inside ImageStorage
    folder_path = os.path.join("ImageStorage", image_folder_name)

    # Check if the folder exists
    if not os.path.exists(folder_path):
        print(f"Folder '{folder_path}' does not exist.")
        return None
    
    combined_text = ""  # Initialize an empty string to store all the text

    # Loop through each file in the folder
    for filename in os.listdir(folder_path):
        # Create the full path to the image file
        image_path = os.path.join(folder_path, filename)

        # Check if the file is an image (you can add more extensions if needed)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            # Load the image
            image = cv2.imread(image_path)

            # Optional: Preprocess image for better OCR accuracy
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
            gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]  # Apply thresholding

            # Convert to PIL format for pytesseract
            pil_image = Image.fromarray(gray)

            # Run OCR
            text = image_to_string(pil_image, lang='eng')  # Set 'eng' for English, or choose another language
            combined_text += text + "\n"  # Append the text from the image to the combined text

        else:
            print(f"Skipping non-image file: {filename}")
    
    # Return the combined text after processing all images
    return combined_text

# Example usage
# reader('Example1')  # Pass the name of the folder inside ImageStorage

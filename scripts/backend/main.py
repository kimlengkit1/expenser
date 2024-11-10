import os
import PIL.Image
import google.generativeai as genai
import json
from dotenv import load_dotenv


from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
import io

load_dotenv()

# Configure the API client with the API key
genai.configure(api_key=os.getenv("API_KEY"))

generation_config = {
    "temperature": 0,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

# Set up the model
model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    safety_settings=safety_settings,
    generation_config=generation_config,
    system_instruction="You are an expert at teaching science to kids. Your task is to engage in conversations about science and answer questions. Explain scientific concepts so that they are easily understandable. Use analogies and examples that are relatable. Use humor and make the conversation both educational and interesting. Ask questions so that you can better understand the user and improve the educational experience. Suggest way that these concepts can be related to the real world with observations and experiments.",
)

def generate_response_image(img):
    # Open the image file using PIL
    
    instruction = "format this into a json file for this receipt with just the prices along with the name, dont give me any response other than the JSON. Format it as {'store': 'tempName', 'date': 'tempDate', 'items': [{name: example1, price: 0}, {name: example2, price: 0}], 'subtotal: 0, tax: 0, total: 0'}"

    # Generate content with streaming enabled
    response = model.generate_content([instruction, img], stream=True)

    # Resolve the streamed response to wait for it to complete
    response.resolve()  # This will finalize the streaming response

    return response.text

def remove_json_block(raw_string):
    # Check if the string starts with triple backticks and contains json at the start
    if raw_string.startswith('```json') and raw_string.endswith('```'):
        # Remove the first and last lines (triple backticks and json label)
        cleaned_string = raw_string[7:-3].strip()  # Removing '```json' at the start and '```' at the end
        return cleaned_string
    return raw_string  # Return the original string if it's not in a JSON block

# Initialize Flask app
app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_image():
    # Check if the request contains a file part
    if 'image' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    image = request.files['image']

    image_bytes = io.BytesIO(image.read())
    image1 = Image.open(image_bytes)

    info = generate_response_image(image1)
    fixedinfo = remove_json_block(info)

    return jsonify(fixedinfo)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
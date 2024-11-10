import os
import PIL.Image
import google.generativeai as genai
from dotenv import load_dotenv
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

def generate_response(input_text):
    """Generates a response using the Gemini model and extracts the text content."""
    response = model.generate_content(input_text)
    
    # # Print the full response to inspect its structure
    # print(response)
    
    # # If you want to check attributes or methods, use the dir function:
    # print(dir(response))
    
    # Now, let's access the text by inspecting its attributes
    try:
        # Attempt to print a meaningful part of the response
        response_text = response._result.candidates[0].content.parts[0].text
        return response_text
    except AttributeError as e:
        print(f"Error accessing response content: {e}")
        return "Error: Unable to extract the response text"

# Generate and print the response
# response_text = generate_response("what is today's date")
# print(response_text)

def generate_response_image(img):
    # Open the image file using PIL
    image = PIL.Image.open(f"{img}.jpg")
    
    instruction = "format this into a json file for this receipt with just the prices along with the name, dont give me any response other than the JSON."

    # Generate content with streaming enabled
    response = model.generate_content([instruction, image], stream=True)

    # Resolve the streamed response to wait for it to complete
    response.resolve()  # This will finalize the streaming response

    # Now you can safely access the final accumulated text
    print(response.text)

# Example usage:
generate_response_image('Example2')

import os
from google import genai
from google.genai.types import HttpOptions
from config import PROJECT_ID, LOCATION, GEMINI_MODEL

client = genai.Client(
    vertexai=True,
    project=PROJECT_ID,
    location=LOCATION,
    http_options=HttpOptions(api_version="v1"),
)

def generate_response(prompt: str):
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return response.text
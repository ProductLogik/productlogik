
import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
gemini_key = os.getenv("GEMINI_API_KEY")

if not gemini_key:
    print("❌ GEMINI_API_KEY not found")
    exit(1)

try:
    client = genai.Client(api_key=gemini_key)
    print("--- Available Gemini Models ---")
    models = client.models.list()
    for m in models:
        print(f"- {m.name}")
except Exception as e:
    print(f"❌ Error listing models: {e}")

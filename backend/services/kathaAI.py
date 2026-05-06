import base64
import json
from openai import OpenAI

client = OpenAI()

def analyze_compatibility_document(file_path: str, user_prompt: str):

    with open(file_path, "rb") as f:
        image_bytes = f.read()
        base64_image = base64.b64encode(image_bytes).decode("utf-8")

    prompt = f"""
You are Katha AI.

User request:
{user_prompt}

Analyze the image and:
1. Understand what is shown
2. Identify missing items
3. Suggest needed items
4. Recommend shops in Cebu
Return JSON:
- ai_comments
- needed_items
- shops
"""

    response = client.responses.create(
        model="gpt-4.1-mini",  
        input=[{
            "role": "user",
            "content": [
                {"type": "input_text", "text": prompt},
                {
                    "type": "input_image",
                    "image_url": f"data:image/png;base64,{base64_image}"
                }
            ]
        }]
    )

    text_output = response.output_text

    try:
        parsed = json.loads(text_output)
    except:
        parsed = {
            "ai_comments": text_output,
            "needed_items": [],
            "shops": []
        }

    return parsed
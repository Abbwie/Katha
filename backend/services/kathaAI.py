import base64
import json
from openai import OpenAI

client = OpenAI()

def analyze_compatibility_document(file_path: str, user_prompt: str):

    with open(file_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")

    prompt = f"""
You are Katha AI.

Return ONLY valid JSON. No explanation.

Schema:
{{
  "ai_comments": string,
  "needed_items": [],
  "shops": []
}}

User request:
{user_prompt}
"""

    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=[{
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},

                    
                    {
                        "type": "input_image",
                        "image_base64": base64_image
                    }
                ]
            }]
        )

        text_output = response.output_text or ""

        print("RAW KATHAAI OUTPUT:", repr(text_output))  

        if not text_output.strip():
            raise ValueError("Empty AI response (image likely not processed)")

        parsed = json.loads(text_output)

        return {
            "ai_comments": parsed.get("ai_comments", ""),
            "needed_items": parsed.get("needed_items", []),
            "shops": parsed.get("shops", []),
            "total_tokens_used": getattr(response, "usage", None).total_tokens if response.usage else 0
        }

    except Exception as e:
        return {
            "ai_comments": f"AI failed: {str(e)}",
            "needed_items": [],
            "shops": [],
            "total_tokens_used": 0
        }
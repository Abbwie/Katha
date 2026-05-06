import base64
import json
from openai import OpenAI

client = OpenAI()

def analyze_compatibility_document(file_path: str, user_prompt: str):
    import base64
    import json
    from openai import OpenAI

    client = OpenAI()

    with open(file_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")

    prompt = f"""
You are Katha AI.

Return ONLY valid JSON.

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
                        "image_url": f"data:image/png;base64,{base64_image}"
                    }
                ]
            }]
        )

        text_output = response.output_text or ""

        print("RAW KATHAAI OUTPUT:", text_output)  

        parsed = json.loads(text_output)

        total_tokens = 0
        if getattr(response, "usage", None):
            total_tokens = response.usage.total_tokens or 0

        return {
            "ai_comments": parsed.get("ai_comments", ""),
            "needed_items": parsed.get("needed_items", []),
            "shops": parsed.get("shops", []),
            "total_tokens_used": total_tokens
        }

    except Exception as e:
        print("AI ERROR:", str(e))

        return {
            "ai_comments": f"AI failed: {str(e)}",
            "needed_items": [],
            "shops": [],
            "total_tokens_used": 0
        }
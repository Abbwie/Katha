# app/services/kathaAI.py
import json
from openai import OpenAI
#test

client = OpenAI()

def analyze_compatibility_document(file_path: str, user_prompt: str):
    with open(file_path, "rb") as f:
        uploaded = client.files.create(
            file=f,
            purpose="user_data"
        )

    prompt = f"""
You are Katha AI.

The user uploaded a document and described what they are looking for.

User request:
{user_prompt}

Tasks:
1. Read the uploaded document.
2. Understand the user's needs.
3. Suggest what is still needed or missing.
4. Recommend relevant shop types or store suggestions.
5. Return JSON with:
   - ai_comments
   - needed_items
   - shops (array of objects with name, reason)
"""

    response = client.responses.create(
        model="gpt-5.5",
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_file", "file_id": uploaded.id},
                    {"type": "input_text", "text": prompt}
                ]
            }
        ]
    )

    text_output = response.output_text

    try:
        parsed = json.loads(text_output)
    except Exception:
        parsed = {
            "ai_comments": text_output,
            "needed_items": [],
            "shops": []
        }

    usage = getattr(response, "usage", None)
    total_tokens = 0
    if usage:
        total_tokens = getattr(usage, "total_tokens", 0) or 0

    return {
        "ai_comments": parsed.get("ai_comments", ""),
        "needed_items": parsed.get("needed_items", []),
        "shops": parsed.get("shops", []),
        "total_tokens_used": total_tokens,
    }
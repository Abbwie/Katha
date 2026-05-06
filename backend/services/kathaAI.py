# services/kathaAI.py
import json
import os
import base64
from openai import OpenAI

client = OpenAI()

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def extract_text_from_file(file_path: str):
    ext = os.path.splitext(file_path)[1].lower()
    if ext in IMAGE_EXTENSIONS:
        return None
    elif ext == ".pdf":
        try:
            import fitz
            doc = fitz.open(file_path)
            return "\n".join([page.get_text() for page in doc])
        except ImportError:
            return "[PDF support requires pymupdf]"
    elif ext == ".docx":
        try:
            import docx
            doc = docx.Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs])
        except ImportError:
            return "[DOCX support requires python-docx]"
    else:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()


def encode_image_to_base64(file_path: str) -> str:
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def get_image_mime_type(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    return {".jpg": "image/jpeg", ".jpeg": "image/jpeg",
            ".png": "image/png", ".webp": "image/webp",
            ".gif": "image/gif"}.get(ext, "image/jpeg")


def clean_json_output(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        lines = [l for l in raw.split("\n") if not l.strip().startswith("```")]
        raw = "\n".join(lines).strip()
    return raw


def analyze_compatibility_document(
    file_path: str,
    user_prompt: str,
    stores_context: list = []   # ← NEW: real stores passed in
) -> dict:

    ext = os.path.splitext(file_path)[1].lower()
    is_image = ext in IMAGE_EXTENSIONS

    # Build stores list for AI context
    stores_text = ""
    if stores_context:
        store_lines = []
        for s in stores_context:
            store_lines.append(
                f"- Store ID {s['id']}: \"{s['name']}\" | "
                f"Category: {s['category']} | "
                f"Location: {s['location']} | "
                f"Description: {s['description']} | "
                f"Services: {', '.join(s['services'])}"
            )
        stores_text = "\n".join(store_lines)
    else:
        stores_text = "No stores available yet."

    system_msg = "You are Katha AI. Always respond with valid JSON only. Never use markdown."

    task_prompt = f"""
You are Katha AI, the smart assistant of Katha — a Philippine tech services marketplace.

A user described their problem. Your job is to:
1. Understand their problem and location.
2. Look through the available stores below and find the best matches.
3. Prioritize stores that match the user's location and needs.
4. Write helpful ai_comments explaining your recommendations.

--- AVAILABLE STORES IN THE MARKETPLACE ---
{stores_text}
--- END OF STORES ---

User Request:
{user_prompt}

Return ONLY valid JSON. No markdown. No explanation outside JSON.

Schema:
{{
  "ai_comments": "Your explanation of what the user needs and which stores you recommend and why",
  "needed_items": ["specific item or service the user needs"],
  "shops": [
    {{
      "store_id": <integer ID from the store list above>,
      "name": "<exact store name from the list>",
      "reason": "<why this specific store matches the user's needs>"
    }}
  ]
}}

IMPORTANT: Only suggest stores from the list above. Use the exact store_id and name.
If no stores match, return an empty shops array.
"""

    try:
        if is_image:
            base64_image = encode_image_to_base64(file_path)
            mime_type = get_image_mime_type(file_path)
            messages = [
                {"role": "system", "content": system_msg},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": task_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ]
        else:
            file_content = extract_text_from_file(file_path) or ""
            truncated = file_content[:4000]
            full_prompt = f"""
--- DOCUMENT CONTENT ---
{truncated}
--- END OF DOCUMENT ---

{task_prompt}
"""
            messages = [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": full_prompt}
            ]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=1000,
        )

        raw_output = response.choices[0].message.content or ""
        print(f"[KathaAI] Raw: {repr(raw_output[:300])}")

        parsed = json.loads(clean_json_output(raw_output))

        return {
            "ai_comments": parsed.get("ai_comments", ""),
            "needed_items": parsed.get("needed_items", []),
            "shops": parsed.get("shops", []),   # now has store_id + name + reason
            "total_tokens_used": response.usage.total_tokens if response.usage else 0,
        }

    except Exception as e:
        print(f"[KathaAI] Error: {str(e)}")
        return {
            "ai_comments": f"AI failed: {str(e)}",
            "needed_items": [], "shops": [], "total_tokens_used": 0,
        }
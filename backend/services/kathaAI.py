import json
import os
import base64
from openai import OpenAI

client = OpenAI()


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def extract_text_from_file(file_path: str) -> str:
    """Returns extracted text. Returns None for images (handled separately)."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext in IMAGE_EXTENSIONS:
        return None  #

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
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception as e:
            return f"[Could not read file: {str(e)}]"


def encode_image_to_base64(file_path: str) -> str:
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def get_image_mime_type(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    return {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
    }.get(ext, "image/jpeg")


def clean_json_output(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        lines = [l for l in raw.split("\n") if not l.strip().startswith("```")]
        raw = "\n".join(lines).strip()
    return raw


def analyze_compatibility_document(file_path: str, user_prompt: str) -> dict:
    ext = os.path.splitext(file_path)[1].lower()
    is_image = ext in IMAGE_EXTENSIONS

    system_msg = "You are Katha AI. Always respond with valid JSON only. Never use markdown."

    schema_instruction = """
Return ONLY valid JSON. No explanation. No markdown. No code fences.

Required schema:
{
  "ai_comments": "Your detailed analysis",
  "needed_items": ["item or service still needed"],
  "shops": [
    {"name": "Type of Shop", "reason": "Why this shop is relevant"}
  ]
}
"""

    try:
        
        if is_image:
            print(f"[KathaAI] Processing image file: {file_path}")
            base64_image = encode_image_to_base64(file_path)
            mime_type = get_image_mime_type(file_path)

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_msg},
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": f"""
You are Katha AI for a Philippine tech marketplace.

Look at the image the user uploaded.
User Request: {user_prompt}

Tasks:
1. Describe what you see in the image.
2. Identify what the user might need based on the image + request.
3. Recommend relevant shop types.

{schema_instruction}
"""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{mime_type};base64,{base64_image}",
                                    "detail": "high"
                                }
                            }
                        ]
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=1000,
            )

        
        else:
            file_content = extract_text_from_file(file_path)
            truncated = file_content[:4000]
            if len(file_content) > 4000:
                truncated += "\n... [content truncated]"

            print(f"[KathaAI] Extracted {len(file_content)} chars from {file_path}")

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_msg},
                    {
                        "role": "user",
                        "content": f"""
You are Katha AI for a Philippine tech marketplace.

--- DOCUMENT CONTENT ---
{truncated}
--- END OF DOCUMENT ---

User Request: {user_prompt}

Tasks:
1. Analyze the document and user's needs.
2. Identify missing items or services.
3. Recommend relevant shop types.

{schema_instruction}
"""
                    }
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=1000,
            )

        
        raw_output = response.choices[0].message.content or ""
        print(f"[KathaAI] Raw output: {repr(raw_output[:200])}")

        cleaned = clean_json_output(raw_output)
        if not cleaned:
            raise ValueError("Empty response from AI")

        parsed = json.loads(cleaned)

        return {
            "ai_comments": parsed.get("ai_comments", "No comments returned."),
            "needed_items": parsed.get("needed_items", []),
            "shops": parsed.get("shops", []),
            "total_tokens_used": response.usage.total_tokens if response.usage else 0,
        }

    except json.JSONDecodeError as e:
        return {
            "ai_comments": f"AI returned invalid JSON: {str(e)}",
            "needed_items": [], "shops": [], "total_tokens_used": 0,
        }
    except Exception as e:
        print(f"[KathaAI] Error: {str(e)}")
        return {
            "ai_comments": f"AI failed: {str(e)}",
            "needed_items": [], "shops": [], "total_tokens_used": 0,
        }
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
    return {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".webp": "image/webp",
        ".gif": "image/gif"
    }.get(ext, "image/jpeg")


def clean_json_output(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        lines = [l for l in raw.split("\n") if not l.strip().startswith("```")]
        raw = "\n".join(lines).strip()
    return raw


def build_stores_text(stores_context: list) -> str:
    if not stores_context:
        return "No stores available yet."

    lines = []
    for s in stores_context:
        capabilities = s.get("capabilities", "").strip()
        cap_line = f"Capabilities: {capabilities} | " if capabilities else ""
        lines.append(
            f"[ID:{s['id']}] {s['name']}\n"
            f"  Location : {s['location']}\n"
            f"  Category : {s['category']}\n"
            f"  Description: {s['description']}\n"
            f"  {cap_line}"
            f"Services : {', '.join(s['services']) if s['services'] else 'N/A'}\n"
        )
    return "\n".join(lines)


def build_system_prompt() -> str:
    return """You are Katha AI, the intelligent matching assistant of Katha — a Philippine tech services marketplace.

Your ONLY job is to match users to real stores from the provided store list.

STRICT RULES you must always follow:
- You may ONLY recommend stores that appear in the STORE LIST provided to you.
- NEVER invent, guess, or hallucinate store names or IDs.
- Use the EXACT store ID (integer) and EXACT store name as written in the list.
- If zero stores match the user's needs, return "shops": [].
- Always match by LOCATION first, then by description and capabilities.
- A store in Cebu must NOT be recommended to a user in Manila, and vice versa, unless no local store exists.
- Base your match on the store's description and capabilities — read them carefully word by word.
- Respond ONLY with valid JSON. Never include markdown, code fences, or explanations outside JSON."""


def build_task_prompt(user_prompt: str, stores_text: str, file_summary: str = "") -> str:
    file_section = f"""
--- UPLOADED FILE CONTENT ---
{file_summary}
--- END OF FILE ---
""" if file_summary else ""

    return f"""
{file_section}
--- AVAILABLE STORES (read carefully before answering) ---
{stores_text}
--- END OF STORE LIST ---

USER REQUEST:
\"\"\"{user_prompt}\"\"\"

MATCHING INSTRUCTIONS:
1. Identify the user's LOCATION from their request (city, region, or province).
2. Identify the SERVICE or PRODUCT they need.
3. Scan EVERY store's description and capabilities for keyword matches.
4. Only include a store if it genuinely matches both location AND service need.
5. Write ai_comments as a helpful, friendly explanation directed at the user.

Return this exact JSON structure:
{{
  "ai_comments": "Friendly explanation to the user about what you found and why these stores fit their needs. Be specific about what matched.",
  "needed_items": ["list", "of", "specific", "things", "the", "user", "needs"],
  "shops": [
    {{
      "store_id": <exact integer ID from the store list>,
      "name": "<exact store name as written in the list>",
      "reason": "<one sentence: what specifically in this store's description/capabilities matches the user's request>"
    }}
  ]
}}
"""


def analyze_compatibility_document(
    file_path: str = None,
    user_prompt: str = "",
    stores_context: list = []
) -> dict:

    stores_text = build_stores_text(stores_context)
    system_msg = build_system_prompt()

    
    if not file_path:
        print(f"[KathaAI] Text-only analysis for: {user_prompt}")
        
        task_prompt = build_task_prompt(user_prompt, stores_text, "")
        
        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": task_prompt}
        ]
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.1,
                max_tokens=1000,
            )
            
            raw_output = response.choices[0].message.content or ""
            print(f"[KathaAI] Raw output: {repr(raw_output[:400])}")
            
            parsed = json.loads(clean_json_output(raw_output))
            
            valid_ids = {s["id"] for s in stores_context}
            safe_shops = [
                shop for shop in parsed.get("shops", [])
                if shop.get("store_id") in valid_ids
            ]
            
            return {
                "ai_comments": parsed.get("ai_comments", ""),
                "needed_items": parsed.get("needed_items", []),
                "shops": safe_shops,
                "total_tokens_used": response.usage.total_tokens if response.usage else 0,
            }
        except Exception as e:
            print(f"[KathaAI] Text-only error: {str(e)}")
            return {
                "ai_comments": f"Based on your request '{user_prompt}', we recommend browsing our marketplace. For better recommendations, please upload a document with your specifications.",
                "needed_items": ["Detailed specifications", "Budget information", "Timeline"],
                "shops": [],
                "total_tokens_used": 0,
            }

    
    ext = os.path.splitext(file_path)[1].lower()
    is_image = ext in IMAGE_EXTENSIONS

    try:
        if is_image:
            
            base64_image = encode_image_to_base64(file_path)
            mime_type = get_image_mime_type(file_path)
            task_prompt = build_task_prompt(user_prompt, stores_text)

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
            if len(file_content) > 4000:
                truncated += "\n...[content truncated]"

            task_prompt = build_task_prompt(user_prompt, stores_text, truncated)

            messages = [
                {"role": "system", "content": system_msg},
                {"role": "user", "content": task_prompt}
            ]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=1000,
        )

        raw_output = response.choices[0].message.content or ""
        print(f"[KathaAI] Raw output: {repr(raw_output[:400])}")

        parsed = json.loads(clean_json_output(raw_output))

        
        valid_ids = {s["id"] for s in stores_context}
        safe_shops = [
            shop for shop in parsed.get("shops", [])
            if shop.get("store_id") in valid_ids
        ]

        return {
            "ai_comments": parsed.get("ai_comments", ""),
            "needed_items": parsed.get("needed_items", []),
            "shops": safe_shops,
            "total_tokens_used": response.usage.total_tokens if response.usage else 0,
        }

    except Exception as e:
        print(f"[KathaAI] Error: {str(e)}")
        return {
            "ai_comments": f"AI failed: {str(e)}",
            "needed_items": [],
            "shops": [],
            "total_tokens_used": 0,
        }
# routes/compatibility.py
import os
import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from db import CompatibilityForm
from services.kathaAI import analyze_compatibility_document


router = APIRouter(prefix="/compatibility", tags=["Compatibility"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/submit")
async def submit_compatibility_form(
    user_id: int = Form(...),
    user_comments: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    record = CompatibilityForm(
        user_id=user_id,
        file_upload=file_path,
        user_comments=user_comments,
        status="pending",
        total_tokens_used=0,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    ai_result = {"needed_items": [], "shops": []}

    try:
        # Step 1: Load all real stores as context for AI
        from routers.stores import get_all_stores
        all_stores = get_all_stores(db=db)  # returns List[StoreResponse]
        stores_context = [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "location": s.location,
                "description": s.description,
                "services": s.services,
            }
            for s in all_stores
        ]

        # Step 2: AI analyzes file + picks from real stores
        ai_result = analyze_compatibility_document(
            file_path=file_path,
            user_prompt=user_comments,
            stores_context=stores_context,   # ← pass real stores
        )

        # Step 3: Look up AI-selected stores by store_id
        selected_ids = [
            shop["store_id"] for shop in ai_result["shops"]
            if "store_id" in shop
        ]
        reasons = {
            shop["store_id"]: shop.get("reason", "")
            for shop in ai_result["shops"]
            if "store_id" in shop
        }

        matched_stores = []
        for store in all_stores:
            if store.id in selected_ids:
                store_dict = store.dict()
                store_dict["ai_reason"] = reasons.get(store.id, "")
                store_dict["is_db_match"] = True
                matched_stores.append(store_dict)

        record.ai_comments = ai_result["ai_comments"]
        record.store_suggested = json.dumps(matched_stores)
        record.total_tokens_used = ai_result["total_tokens_used"]
        record.status = "completed"

    except Exception as e:
        print(f"[Compatibility ERROR]: {str(e)}")
        db.rollback()
        record = db.query(CompatibilityForm).filter(
            CompatibilityForm.id == record.id
        ).first()
        record.ai_comments = f"Error: {str(e)[:300]}"
        record.status = "failed"

    finally:
        db.commit()
        db.refresh(record)

    return {
        "id": record.id,
        "status": record.status,
        "ai_comments": record.ai_comments,
        "needed_items": ai_result.get("needed_items", []),
        "store_suggested": json.loads(record.store_suggested) if record.store_suggested else [],
        "total_tokens_used": record.total_tokens_used,
    }
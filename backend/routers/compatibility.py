# routes/compatibility.py
import os
import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from db import get_db
from db import CompatibilityForm
from services.kathaAI import analyze_compatibility_document
from services.store_matcher import match_stores_to_ai_suggestions  

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
        
        ai_result = analyze_compatibility_document(
            file_path=file_path,
            user_prompt=user_comments
        )

      
        matched_stores = match_stores_to_ai_suggestions(db, ai_result["shops"])

        
        record.ai_comments = ai_result["ai_comments"]
        record.store_suggested = json.dumps(matched_stores)
        record.total_tokens_used = ai_result["total_tokens_used"]
        record.status = "completed"

    except Exception as e:
        print(f"[Compatibility ERROR]: {str(e)}")
        db.rollback()                        # ← reset broken session

        # Re-fetch after rollback
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

@router.get("/{form_id}")
def get_compatibility_result(form_id: int, db: Session = Depends(get_db)):
    record = db.query(CompatibilityForm).filter(CompatibilityForm.id == form_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Form not found")

    return {
        "id": record.id,
        "status": record.status,
        "ai_comments": record.ai_comments,
        "store_suggested": json.loads(record.store_suggested) if record.store_suggested else [],
        "total_tokens_used": record.total_tokens_used,
    }
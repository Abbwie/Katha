import os
import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from db import get_db, CompatibilityForm, ProviderProfile, Service
from services.kathaAI import analyze_compatibility_document

router = APIRouter(prefix="/compatibility", tags=["Compatibility"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def load_stores_context(db: Session) -> list:
    profiles = db.query(ProviderProfile).all()
    print(f"[DEBUG] Found {len(profiles)} provider profiles total")

    stores = []
    for profile in profiles:
        service_candidates = []

        if profile.user_id is not None:
            service_candidates = db.query(Service).filter(
                Service.provider_id == profile.user_id
            ).all()

        prices = [s.price for s in service_candidates if s.price is not None]

        store_id = profile.user_id if profile.user_id is not None else profile.id

        store = {
            "id": int(store_id),
            "name": profile.business_name or f"Store {profile.id}",
            "category": service_candidates[0].category if service_candidates else "general",
            "location": profile.business_address or "",
            "description": profile.description or "",
            "capabilities": profile.capabilities or "",
            "services": [s.title for s in service_candidates[:5] if s.title],
            "price_range_min": min(prices) if prices else 0,
            "price_range_max": max(prices) if prices else 0,
            "verified": bool(profile.is_verified),
            "image": "https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=400&h=300&fit=crop",
        }

        # only skip truly empty junk rows
        has_meaningful_data = any([
            store["name"],
            store["location"],
            store["description"],
            store["capabilities"],
            len(store["services"]) > 0
        ])

        if has_meaningful_data:
            stores.append(store)

    print(f"[Stores] Loaded {len(stores)} stores: {[s['name'] for s in stores]}")
    return stores


def get_matched_stores(all_stores: list, ai_shops: list) -> list:
    store_map = {int(s["id"]): s for s in all_stores}
    matched = []

    for shop in ai_shops:
        store_id = shop.get("store_id")
        if store_id is None:
            continue

        try:
            store_id = int(store_id)
        except Exception:
            continue

        if store_id in store_map:
            store = dict(store_map[store_id])
            store["ai_reason"] = shop.get("reason", "")
            store["is_db_match"] = True
            matched.append(store)

    return matched


@router.post("/submit")
async def submit_compatibility_form(
    user_id: int = Form(...),
    user_comments: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    safe_filename = f"{user_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

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
        stores_context = load_stores_context(db)
        print(f"[Compatibility] Loaded {len(stores_context)} stores for AI context")

        ai_result = analyze_compatibility_document(
            file_path=file_path,
            user_prompt=user_comments,
            stores_context=stores_context,
        )
        print(f"[Compatibility] AI selected store IDs: {[s.get('store_id') for s in ai_result.get('shops', [])]}")

        matched_stores = get_matched_stores(stores_context, ai_result.get("shops", []))
        print(f"[Compatibility] Final matched stores: {[s['name'] for s in matched_stores]}")

        record.ai_comments = ai_result.get("ai_comments", "")
        record.store_suggested = json.dumps(matched_stores)
        record.total_tokens_used = ai_result.get("total_tokens_used", 0)
        record.status = "completed"
        db.commit()

    except Exception as e:
        print(f"[Compatibility ERROR]: {str(e)}")
        db.rollback()

        failed_record = db.query(CompatibilityForm).filter(
            CompatibilityForm.id == record.id
        ).first()

        if failed_record:
            failed_record.ai_comments = f"Error: {str(e)[:300]}"
            failed_record.status = "failed"
            db.commit()
            record = failed_record

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
    record = db.query(CompatibilityForm).filter(
        CompatibilityForm.id == form_id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Form not found")

    return {
        "id": record.id,
        "status": record.status,
        "ai_comments": record.ai_comments,
        "store_suggested": json.loads(record.store_suggested) if record.store_suggested else [],
        "total_tokens_used": record.total_tokens_used,
    }
import os
import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from db import get_db, CompatibilityForm, User, ProviderProfile, Service
from services.kathaAI import analyze_compatibility_document

router = APIRouter(prefix="/compatibility", tags=["Compatibility"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def load_stores_context(db: Session) -> list:
    """
    Loads ALL active providers directly from DB with full detail.
    This is what gets passed to the AI — the richer this is, the better the matching.
    """
    providers = db.query(User).filter(User.is_provider == True).all()
    stores = []

    for provider in providers:
        profile = db.query(ProviderProfile).filter(
            ProviderProfile.user_id == provider.id,
            ProviderProfile.is_active == True
        ).first()
        if not profile:
            continue

        # Skip providers with no useful data
        if not profile.description and not profile.capabilities and not profile.business_address:
            continue

        services = db.query(Service).filter(
            Service.provider_id == provider.id
        ).all()

        prices = [s.price for s in services if s.price]

        stores.append({
            "id": provider.id,
            "name": profile.business_name or provider.username,
            "category": services[0].category if services else "general",
            "location": profile.business_address or "Philippines",
            "description": profile.description or "",
            "capabilities": profile.capabilities or "",   # ← key for matching
            "services": [s.title for s in services[:5] if s.title],
            "price_range_min": min(prices) if prices else 0,
            "price_range_max": max(prices) if prices else 0,
            "verified": profile.is_verified,
            "image": "https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=400&h=300&fit=crop",
        })

    return stores


def get_matched_stores(all_stores: list, ai_shops: list) -> list:
    """
    Looks up AI-selected store_ids against the real store list.
    Strips any hallucinated IDs that don't exist in DB.
    """
    store_map = {s["id"]: s for s in all_stores}
    reasons = {
        shop["store_id"]: shop.get("reason", "")
        for shop in ai_shops
        if "store_id" in shop
    }

    matched = []
    for shop in ai_shops:
        store_id = shop.get("store_id")
        if store_id and store_id in store_map:
            store = dict(store_map[store_id])       # copy
            store["ai_reason"] = reasons.get(store_id, "")
            store["is_db_match"] = True
            matched.append(store)
        # if store_id not in store_map → silently dropped (hallucination blocked)

    return matched


@router.post("/submit")
async def submit_compatibility_form(
    user_id: int = Form(...),
    user_comments: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Save uploaded file
    safe_filename = f"{user_id}_{file.filename}"   # avoid filename collisions
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Create pending record
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
        # Step 1: Load real stores from DB (with capabilities + description)
        stores_context = load_stores_context(db)
        print(f"[Compatibility] Loaded {len(stores_context)} stores for AI context")

        # Step 2: Run AI with real store context
        ai_result = analyze_compatibility_document(
            file_path=file_path,
            user_prompt=user_comments,
            stores_context=stores_context,
        )
        print(f"[Compatibility] AI selected store IDs: {[s.get('store_id') for s in ai_result['shops']]}")

        # Step 3: Map AI selections back to real store data (blocks hallucinations)
        matched_stores = get_matched_stores(stores_context, ai_result["shops"])
        print(f"[Compatibility] Final matched stores: {[s['name'] for s in matched_stores]}")

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

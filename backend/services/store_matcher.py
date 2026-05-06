
from sqlalchemy.orm import Session
from db import User, ProviderProfile, Service

def match_stores_to_ai_suggestions(db: Session, ai_shops: list) -> list:
    """
    ai_shops: list of shop names or dicts returned by kathaAI
    Returns: list of matched StoreResponse-like dicts
    """
    providers = db.query(User).filter(User.is_provider == True).all()
    matched = []

    for provider in providers:
        profile = db.query(ProviderProfile).filter(
            ProviderProfile.user_id == provider.id
        ).first()
        if not profile:
            continue

        services = db.query(Service).filter(Service.provider_id == provider.id).all()
        store_name = (profile.business_name or provider.username).lower()
        categories = list(set([s.category for s in services]))

        for ai_shop in ai_shops:
            # ai_shop can be a string name or dict with "name"/"category"
            shop_name = ai_shop if isinstance(ai_shop, str) else ai_shop.get("name", "")
            shop_category = ai_shop.get("category", "") if isinstance(ai_shop, dict) else ""

            name_match = shop_name.lower() in store_name or store_name in shop_name.lower()
            cat_match = any(shop_category.lower() in c.lower() for c in categories)

            if name_match or cat_match:
                prices = [s.price for s in services if s.price]
                matched.append({
                    "id": provider.id,
                    "name": profile.business_name or provider.username,
                    "category": categories[0] if categories else "general",
                    "location": profile.business_address or "Philippines",
                    "services": [s.title for s in services[:5]],
                    "price_range_min": min(prices) if prices else 0,
                    "price_range_max": max(prices) if prices else 0,
                    "verified": profile.is_verified,
                    "match_reason": f"AI suggested: {shop_name}",
                })
                break  # avoid duplicate stores

    return matched
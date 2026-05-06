
from sqlalchemy.orm import Session
from models import User, ProviderProfile, Service

def match_stores_to_ai_suggestions(db: Session, ai_shops: list) -> list:
    providers = db.query(User).filter(User.is_provider == True).all()
    matched = []
    seen_provider_ids = set()

    for ai_shop in ai_shops:
        shop_label = ai_shop.get("name", "").lower()
        shop_reason = ai_shop.get("reason", "")

        for provider in providers:
            if provider.id in seen_provider_ids:
                continue

            profile = db.query(ProviderProfile).filter(
                ProviderProfile.user_id == provider.id
            ).first()
            if not profile:
                continue

            services = db.query(Service).filter(
                Service.provider_id == provider.id
            ).all()

            store_name = (profile.business_name or provider.username).lower()
            service_titles = " ".join([s.title.lower() for s in services])
            service_categories = " ".join([s.category.lower() for s in services if s.category])

            # Match by keyword overlap between AI suggestion and store data
            keywords = shop_label.replace("shop", "").replace("studio", "").split()
            is_match = any(
                kw in store_name or kw in service_titles or kw in service_categories
                for kw in keywords if len(kw) > 2
            )

            if is_match:
                prices = [s.price for s in services if s.price]
                matched.append({
                    "id": provider.id,
                    "name": profile.business_name or provider.username,
                    "category": services[0].category if services else "general",
                    "location": profile.business_address or "Philippines",
                    "services": [s.title for s in services[:5]],
                    "price_range_min": min(prices) if prices else 0,
                    "price_range_max": max(prices) if prices else 0,
                    "verified": profile.is_verified,
                    "ai_suggested_type": ai_shop.get("name"),
                    "ai_reason": shop_reason,
                })
                seen_provider_ids.add(provider.id)

    return matched
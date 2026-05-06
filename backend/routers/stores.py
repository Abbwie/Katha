# backend/routers/stores.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from db import get_db, User, ProviderProfile, Service

router = APIRouter(prefix="/stores", tags=["Stores"])

# Response model for store listing
class StoreResponse(BaseModel):
    id: int
    name: str
    business_name: str
    category: str
    location: str
    rating: float
    description: str
    price_range_min: float
    price_range_max: float
    turnaround_days: int
    verified: bool
    image: str
    services: List[str]

    class Config:
        from_attributes = True

# Get all stores (for marketplace browsing)
@router.get("/", response_model=List[StoreResponse])
def get_all_stores(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Get all providers
    providers = db.query(User).filter(User.is_provider == True).all()
    
    stores = []
    for provider in providers:
        # Get provider profile
        profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == provider.id).first()
        if not profile:
            continue
            
        # Get provider's services
        services = db.query(Service).filter(Service.provider_id == provider.id).all()
        
        # Calculate price range
        prices = [s.price for s in services if s.price]
        price_min = min(prices) if prices else 0
        price_max = max(prices) if prices else 0
        
        # Get categories from services
        categories = list(set([s.category for s in services]))
        
        store_data = StoreResponse(
            id=provider.id,
            name=profile.business_name or provider.username,
            business_name=profile.business_name or "",
            category=categories[0] if categories else "general",
            location=profile.business_address or "Philippines",
            rating=4.5,  # TODO: Calculate from reviews
            description=profile.description or "",
            price_range_min=price_min,
            price_range_max=price_max,
            turnaround_days=5,  # TODO: Calculate from services
            verified=profile.is_verified,
            image="https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=400&h=300&fit=crop",
            services=[s.title for s in services[:5]]
        )
        
        # Apply filters
        if category and store_data.category != category:
            continue
        if search and search.lower() not in store_data.name.lower() and search.lower() not in " ".join(store_data.services).lower():
            continue
            
        stores.append(store_data)
    
    return stores

# Get single store by ID
@router.get("/{store_id}", response_model=StoreResponse)
def get_store(store_id: int, db: Session = Depends(get_db)):
    provider = db.query(User).filter(User.id == store_id, User.is_provider == True).first()
    if not provider:
        raise HTTPException(status_code=404, detail="Store not found")
    
    profile = db.query(ProviderProfile).filter(ProviderProfile.user_id == provider.id).first()
    services = db.query(Service).filter(Service.provider_id == provider.id).all()
    
    prices = [s.price for s in services if s.price]
    categories = list(set([s.category for s in services]))
    
    return StoreResponse(
        id=provider.id,
        name=profile.business_name or provider.username,
        business_name=profile.business_name or "",
        category=categories[0] if categories else "general",
        location=profile.business_address or "Philippines",
        rating=4.5,
        description=profile.description or "",
        price_range_min=min(prices) if prices else 0,
        price_range_max=max(prices) if prices else 0,
        turnaround_days=5,
        verified=profile.is_verified,
        image="https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=400&h=300&fit=crop",
        services=[s.title for s in services[:5]]
    )
import string

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from dotenv import load_dotenv
from pathlib import Path
import os

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Check your .env file or Railway variables.")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key = True, index = True)
    username = Column(String, unique = True, index = True)
    hashed_password = Column(String)
    full_name = Column(String, nullable = True)
    email = Column(String, nullable = True)
    location = Column(String, nullable = True)
    is_provider = Column(Boolean, default = False)
    provider_profile = relationship("ProviderProfile", back_populates="user")

class Quote(Base):
    __tablename__ = "quotes"
    id = Column(Integer, primary_key = True, index = True)
    client_id = Column(Integer, ForeignKey("login.id"))
    provider_id = Column(Integer, ForeignKey("login.id"))
    file_url = Column(String)
    quantity = Column(Integer)
    status = Column(String)
    estimated_price = Column(Float)
    requested_time = Column(DateTime(timezone = True), server_default = func.now())

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key = True, index = True)
    client_id = Column(Integer, ForeignKey("login.id"))
    provider_id = Column(Integer, ForeignKey("login.id"))
    category = Column(String)
    price = Column(Float)
    price_unit = Column(String)
    min_order_qty = Column(Integer, default = 1)
    is_active = Column(Boolean)
    create_time = Column(DateTime(timezone = True), server_default = func.now())

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key = True, index = True)
    client_id = Column(Integer, ForeignKey("login.id"))
    provider_id = Column(Integer, ForeignKey("login.id"))
    quote_id = Column(Integer, ForeignKey("quotes.id"))
    status = Column(String)
    total_amount = Column(Float)
    payment_status = Column(String)
    create_time = Column(DateTime(timezone = True), server_default = func.now())
    complete_time = Column(DateTime(timezone = True), nullable = True)


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key = True, index = True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    client_id = Column(Integer, ForeignKey("login.id"))
    provider_id = Column(Integer, ForeignKey("login.id"))
    rating = Column(Integer)
    comment = Column(Text)
    create_time = Column(DateTime(timezone = True), server_default = func.now())

class CompatibilityForm(Base):
    __tablename__ = "compatibility_forms"
    id = Column(Integer, primary_key = True, index = True)
    client_id = Column(Integer, ForeignKey("login.id"))
    provider_id = Column(Integer, ForeignKey("login.id"))
    file_upload = Column (String(255), nullable= True)
    user_comments = Column (Text, nullable = True)
    ai_comments = Column (Text, nullable = True)
    store_suggested = Column (Text, nullable = True)
    status = Column(String(50), nullable = False, default = "Pending")
    total_tokens_used = Column (Integer, nullable = False, default =  0)
    created_at = Column (DateTime(timezone = True), server_default = func.now(), nullable = False)

class ProviderProfile(Base):
    __tablename__ = "provider_profiles"
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("login.id"), unique = True)

    business_name = Column(String)
    business_address = Column(String)
    business_phone = Column(String)
    business_email = Column(String)
    business_registration_number = Column(String, nullable = True)

    is_verified = Column(Boolean, default = False)
    verification_documents_url = Column(String, nullable = True)

    description = Column(Text, nullable=True)
    capabilities = Column(Text, nullable=True) #service
    min_order = Column(Float)
    max_order = Column(Float)

    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates = "provider_profile")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
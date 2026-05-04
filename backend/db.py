from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float, func
from sqlalchemy.orm import sessionmaker, declarative_base
import os



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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
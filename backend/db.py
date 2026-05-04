from sqlalchemy import create_engine, Column, Integer, String
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
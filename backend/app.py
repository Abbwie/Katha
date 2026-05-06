from fastapi import FastAPI
from sqlalchemy import create_engine, text
import os
from routers.login import router as login_router
from db import Base, engine, get_db, ensure_schema
from models import login
# from routers.compatibility import router as compatibility_router
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends
from routers.stores import router as stores_router



app = FastAPI()

#-- CORS setup
origins = [
    "http://localhost:3000",
    os.getenv("CORS_ORIGINS", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
ensure_schema()

# app.include_router(compatibility_router)
app.include_router(login_router)  
app.include_router(stores_router)

@app.get("/")
def root():
    return {"ok": True}

@app.get("/db-test")
def db_test():
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://")
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        version = result.fetchone()[0]
    return {"postgres_version": version}

@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM users"))
    rows = result.fetchall()
    return [dict(row._mapping) for row in rows]
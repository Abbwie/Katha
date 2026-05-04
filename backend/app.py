from fastapi import FastAPI
from sqlalchemy import create_engine, text
import os

app = FastAPI()

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
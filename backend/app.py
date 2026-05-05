from fastapi import FastAPI
from sqlalchemy import create_engine, text
import os
from routers.login import router as login_router
from db import Base, engine
from models import login
from routers.compatibility import router as compatibility_router


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(compatibility_router)
app.include_router(login_router)  

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
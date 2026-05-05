from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

#variable name : OPENAI_API_KEY

router = APIRouter()
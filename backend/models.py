from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from db import Base


class login(Base):
    __tablename__ = "login"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(20), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

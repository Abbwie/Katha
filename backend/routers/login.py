from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import bcrypt

from db import SessionLocal as LoginSessionLocal, engine as login_engine
from models import Base as LoginBase, login

# Create tables if they don't exist
#LoginBase.metadata.create_all(bind=login_engine)

router = APIRouter(tags=["Login"])


#get login db session
def get_login_db():
    db = LoginSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Hashing passwords
def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_password.encode('utf-8'), salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


# POST request models
class LoginRequest(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    password: str


# register a new user

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_login_db)):
    """Register a new user"""

    # Check if username already exists
    existing_user = db.query(login).filter(login.username == user.username).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Username already exists"
        )

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create new user
    new_user = login(
        username=user.username,
        hashed_password=hashed_password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User registered successfully",
            "user_id": new_user.id,
            "username": new_user.username
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/Katha_Login")
def loginarea(req: LoginRequest, db: Session = Depends(get_login_db)):
    # Get login by username only
    Login = db.query(login).filter(login.username == req.username).first()

    if not Login or not verify_password(req.password, Login.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Return safe info INCLUDING user_id
    return {
        "username": Login.username,
        "user_id": Login.id,
        "message": "Login successful"
    }


#DONT USE - for testing only

@router.get("/LoginData")
def get_login_data(db: Session = Depends(get_login_db)):
    logins = db.query(login).all()
    return logins
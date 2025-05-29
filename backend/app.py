from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from models import UserSignup, MedicalHistory, UserLogin, UserWithHistoryResponse
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from fastapi import HTTPException, Depends
from typing import List, Dict, Any
import os
import logging
import tempfile
from utils.predict import predict_skin_disease
import requests
import tempfile
from fastapi import UploadFile, File, Depends, HTTPException
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from pydantic import BaseModel


from fastapi import HTTPException, Depends
from typing import List, Dict, Any
from bson import ObjectId

load_dotenv()

app = FastAPI()


SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


uri = os.getenv("MONGO_URI")

client = MongoClient(uri, server_api=ServerApi('1'))
db = client["database"]
users = db["users"]
history_collection = db["history"]
try:
    client.admin.command('ping')
    print("✅ MongoDB Atlas connection established.")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB Atlas: {e}")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://medical-symptom-checker-five.vercel.app/"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user


@app.get("/")
def home():
    return {"message": "Skin Disease Detection API is running!"}

@app.post("/register")
async def register(user_data: UserSignup):

    if users.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user document
    user_dict = user_data.dict()
    user_dict["hashed_password"] = get_password_hash(user_data.password)
    user_dict.pop("confirmPassword", None)
    user_dict["created_at"] = datetime.now(timezone.utc)
    user_dict["updated_at"] = datetime.now(timezone.utc)
    user_dict["role"] = "patient" 
    

    result = users.insert_one(user_dict)
    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }
@app.get("/verify-token")
async def verify_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        
    
        user = users.find_one({"email": email})
        if user is None:
            raise credentials_exception
            
        return {"valid": True, "user": email}
    except JWTError:
        raise credentials_exception
@app.post("/login")
async def login(credentials: UserLogin):
    user = users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "id": str(user["_id"]),
            "firstName": user.get("firstName", ""),
            "lastName": user.get("lastName", ""),
            "email": user["email"],
            "role": user.get("role", "patient")
        }
    }

@app.get("/users/me")
async def read_users_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "firstName": current_user.get("firstName", ""),
        "lastName": current_user.get("lastName", ""),
        "role": current_user.get("role", "patient")
    }


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        
        result = predict_skin_disease(temp_path)
        
        if not result.get("success", False):
            raise HTTPException(
                status_code=400,
                detail=result.get("error", "Prediction failed")
            )
        

        history_record = {
            "user_id": current_user["_id"],
            "prediction": result,
            "created_at": datetime.now(timezone.utc)
        }
        history_collection.insert_one(history_record)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Server error: {str(e)}"
        )
    finally:
 
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.unlink(temp_path)

@app.post("/save-history")
async def save_history(
    history: MedicalHistory,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        history_dict = history.dict()
        history_dict["user_id"] = current_user["_id"]
        history_dict["created_at"] = datetime.now(timezone.utc)
        history_collection.insert_one(history_dict)
        return {"message": "History saved successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/history")
async def get_history(current_user: Dict[str, Any] = Depends(get_current_user)):
    try:
        user_history = history_collection.find({"user_id": current_user["_id"]})
        return [{"id": str(h["_id"]), **h} for h in user_history]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/dashboard-history")
async def get_dashboard_history(current_user: Dict[str, Any] = Depends(get_current_user)):
    try:
        # Get history sorted by date (newest first)
        user_history = list(history_collection.find(
            {"user_id": current_user["_id"]},
            {"_id": 1, "prediction": 1, "created_at": 1}
        ).sort("created_at", -1))
        
        # Format the response for dashboard
        formatted_history = []
        for record in user_history:
            prediction = record.get("prediction", {})
            formatted_history.append({
                "id": str(record["_id"]),
                "condition": prediction.get("disease", "Unknown Condition"),
                "confidence": prediction.get("confidence", 0),
                "date": record["created_at"].strftime("%B %d, %Y"),
                "symptoms": prediction.get("symptoms", []),
                "diagnosis": prediction.get("diagnosis", "No diagnosis available"),
                "treatment": prediction.get("treatment", "Consult your doctor"),
                "notes": prediction.get("notes", "No additional notes")
            })
        
        return formatted_history
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )       
    





@app.get("/users")
async def get_all_users(current_user: Dict[str, Any] = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    all_users = users.find()
    user_list = []
    for user in all_users:
        user_histories = list(history_collection.find({"user_id": user["_id"]}))
        formatted_histories = []
        for h in user_histories:
            prediction = h.get("prediction", {})
            formatted_histories.append({
                "id": str(h["_id"]),
                "condition": prediction.get("disease", ""),
                "confidence": prediction.get("confidence", 0),
                "label": prediction.get("label"),
                "success": prediction.get("success", False),
                "created_at": h.get("created_at").strftime("%Y-%m-%d %H:%M:%S") if h.get("created_at") else None
            })

        user_list.append({
            "id": str(user["_id"]),
            "name": f"{user.get('firstName', '')} {user.get('lastName', '')}".strip(),
            "email": user.get("email", ""),
            "dateJoined": user.get("created_at").strftime("%b %d, %Y") if user.get("created_at") else "N/A",
            "histories": formatted_histories
        })
    return user_list

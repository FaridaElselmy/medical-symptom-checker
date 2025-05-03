from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional
from datetime import datetime, timezone, timedelta



class UserSignup(BaseModel):
    firstName: str = Field(..., alias="firstName")
    lastName: str = Field(..., alias="lastName")
    email: EmailStr
    password: str 
    confirmPassword: str = Field(..., alias="confirmPassword")
    
    class Config:
        # Exclude confirm_password from the final output dictionary
        orm_mode = True
        allow_population_by_field_name = True
        

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserSignup):
    hashed_password: str
    created_at: datetime = datetime.now(timezone.utc)
    updated_at: datetime = datetime.now(timezone.utc)

class MedicalHistory(BaseModel):
    user_id: str
    condition: str
    diagnosis_date: Optional[datetime] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None
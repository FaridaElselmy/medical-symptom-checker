from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Union
from pydantic import BaseModel



class UserSignup(BaseModel):
    firstName: str = Field(..., alias="firstName")
    lastName: str = Field(..., alias="lastName")
    email: EmailStr
    password: str 
    confirmPassword: str = Field(..., alias="confirmPassword")
    
    class Config:
        
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
    condition: str
    diagnosis_date: Optional[datetime] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None
    
class ChatRequest(BaseModel):
    prompt: str



class MedicalHistoryResponse(BaseModel):
    id: str
    condition: str
    diagnosis_date: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None

class UserWithHistoryResponse(BaseModel):
    id: str
    name: str
    email: str
    dateJoined: str
    histories: List[MedicalHistoryResponse] = []

class DiabetesInput(BaseModel):
    age: float
    bmi: float
    hypertension: Union[int, str]
    heart_disease: Union[int, str]
    smoking_history: Union[int, str]
    HbA1c_level: float
    blood_glucose_level: float
    gender: Union[int, str]
    cholesterol_level: Optional[float] = 0
    physical_activity: Optional[float] = 0
    diet_quality: Optional[float] = 0
    family_history: Optional[int] = 0
    waist_circumference: Optional[float] = 0
    systolic_bp: Optional[float] = 0
    diastolic_bp: Optional[float] = 0
    triglycerides: Optional[float] = 0
    # These default to 0 if user doesn’t pass them
    class_: Optional[int] = Field(0, alias="class")
    id: Optional[int] = 0
    no_pation: Optional[int] = 0

    @validator("hypertension", "heart_disease", pre=True)
    def yes_no_to_int(cls, v):
        if isinstance(v, str):
            return 1 if v.lower() == "yes" else 0
        return v

    @validator("gender", pre=True)
    def gender_to_int(cls, v):
        if isinstance(v, str):
            return 1 if v.lower() == "male" else 0
        return v

    @validator("smoking_history", pre=True)
    def smoke_to_int(cls, v):
        mapping = {
            "never": 0,
            "former": 1,
            "current": 2,
            "ever": 3,
            "not current": 4
        }
        if isinstance(v, str):
            return mapping.get(v.lower(), 0)
        return v

from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from pydantic import BaseModel


class UserSignup(BaseModel):
    firstName: str = Field(..., alias="firstName")
    lastName: str = Field(..., alias="lastName")
    email: EmailStr
    password: str 
    confirmPassword: str = Field(..., alias="confirmPassword")
    
    class Config:
        
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
    
class ChatRequest(BaseModel):
    prompt: str



class MedicalHistoryResponse(BaseModel):
    id: str
    condition: str
    diagnosis_date: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None

class UserWithHistoryResponse(BaseModel):
    id: str
    name: str
    email: str
    dateJoined: str
    histories: List[MedicalHistoryResponse] = []

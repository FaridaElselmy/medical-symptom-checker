from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from typing import Optional, List, Union
from datetime import datetime, timezone

class UserSignup(BaseModel):
    firstName: str = Field(..., alias="firstName")
    lastName: str = Field(..., alias="lastName")
    email: EmailStr
    password: str 
    confirmPassword: str = Field(..., alias="confirmPassword")
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserSignup):
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MedicalHistory(BaseModel):
    user_id: Optional[str] = None
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
    class_: Optional[int] = Field(0, alias="class")
    id: Optional[int] = 0
    no_pation: Optional[int] = 0

    @field_validator("hypertension", "heart_disease", mode="before")
    @classmethod
    def yes_no_to_int(cls, v):
        if isinstance(v, str):
            return 1 if v.lower() == "yes" else 0
        return v

    @field_validator("gender", mode="before")
    @classmethod
    def gender_to_int(cls, v):
        if isinstance(v, str):
            return 1 if v.lower() == "male" else 0
        return v

    @field_validator("smoking_history", mode="before")
    @classmethod
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

class KidneyDiseaseInput(BaseModel):
    """Input model for kidney disease prediction"""
    
    # Numerical features
    age: float = Field(..., description="Age in years", ge=0, le=120)
    bp: float = Field(..., description="Blood Pressure (mmHg)", ge=50, le=200)
    sg: float = Field(..., description="Specific Gravity", ge=1.005, le=1.025)
    al: float = Field(..., description="Albumin level (0-5)", ge=0, le=5)
    su: float = Field(..., description="Sugar level (0-5)", ge=0, le=5)
    bgr: float = Field(..., description="Blood Glucose Random (mg/dL)", ge=50, le=500)
    bu: float = Field(..., description="Blood Urea (mg/dL)", ge=10, le=200)
    sc: float = Field(..., description="Serum Creatinine (mg/dL)", ge=0.5, le=15)
    sod: float = Field(..., description="Sodium (mEq/L)", ge=120, le=160)
    pot: float = Field(..., description="Potassium (mEq/L)", ge=2.5, le=8.0)
    hemo: float = Field(..., description="Hemoglobin (g/dL)", ge=5, le=20)
    pcv: float = Field(..., description="Packed Cell Volume", ge=20, le=60)
    wc: float = Field(..., description="White Blood Cell Count (cells/cumm)", ge=2000, le=25000)
    rc: float = Field(..., description="Red Blood Cell Count (millions/cmm)", ge=2.5, le=8.0)
    
    # Categorical features (can be string or numeric)
    rbc: Union[str, int] = Field(..., description="Red Blood Cells (normal/abnormal or 0/1)")
    pc: Union[str, int] = Field(..., description="Pus Cell (normal/abnormal or 0/1)")
    pcc: Union[str, int] = Field(..., description="Pus Cell Clumps (notpresent/present or 0/1)")
    ba: Union[str, int] = Field(..., description="Bacteria (notpresent/present or 0/1)")
    htn: Union[str, int] = Field(..., description="Hypertension (no/yes or 0/1)")
    dm: Union[str, int] = Field(..., description="Diabetes Mellitus (no/yes or 0/1)")
    cad: Union[str, int] = Field(..., description="Coronary Artery Disease (no/yes or 0/1)")
    appet: Union[str, int] = Field(..., description="Appetite (good/poor or 0/1)")
    pe: Union[str, int] = Field(..., description="Pedal Edema (no/yes or 0/1)")
    ane: Union[str, int] = Field(..., description="Anemia (no/yes or 0/1)")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "age": 48.0,
                "bp": 80.0,
                "sg": 1.020,
                "al": 1.0,
                "su": 0.0,
                "rbc": "normal",
                "pc": "normal", 
                "pcc": "notpresent",
                "ba": "notpresent",
                "bgr": 121.0,
                "bu": 36.0,
                "sc": 1.2,
                "sod": 137.0,
                "pot": 4.6,
                "hemo": 15.4,
                "pcv": 44.0,
                "wc": 7800.0,
                "rc": 5.2,
                "htn": "no",
                "dm": "no",
                "cad": "no",
                "appet": "good",
                "pe": "no",
                "ane": "no"
            }
        }
    )
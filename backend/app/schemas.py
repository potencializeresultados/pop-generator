from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Schemas para Company
class CompanyBase(BaseModel):
    name: str
    primary_color: str
    secondary_color: str

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: int
    logo_path: str
    created_at: datetime
    
    class Config:
        orm_mode = True

# Schemas para POP
class POPBase(BaseModel):
    procedure_name: str
    pop_code: str
    department: str
    periodicity: str
    start_date: str
    target_date: Optional[str] = None
    legal_date: Optional[str] = None
    competence: str
    tax_regime: str
    complexity: str
    responsible: str
    automatic_routine: str
    estimated_time: str
    description: str

class POPCreate(POPBase):
    company_id: int

class POPResponse(POPBase):
    id: int
    company_id: int
    document_path: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    primary_color = Column(String)
    secondary_color = Column(String)
    logo_path = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relacionamento com POPs
    pops = relationship("POP", back_populates="company")

class POP(Base):
    __tablename__ = "pops"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    procedure_name = Column(String, index=True)
    pop_code = Column(String, index=True)
    department = Column(String)
    periodicity = Column(String)
    start_date = Column(String)
    target_date = Column(String, nullable=True)
    legal_date = Column(String, nullable=True)
    competence = Column(String)
    tax_regime = Column(String)
    complexity = Column(String)
    responsible = Column(String)
    automatic_routine = Column(String)
    estimated_time = Column(String)
    description = Column(Text)
    document_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relacionamento com Company
    company = relationship("Company", back_populates="pops")

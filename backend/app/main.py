from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List
import os
import shutil
from datetime import datetime
import uuid

from app.database import get_db, engine, Base
from app.models import POP, Company
from app.schemas import POPCreate, POPResponse, CompanyCreate, CompanyResponse
from app.docx_generator import generate_pop_document

# Criar diretórios necessários
os.makedirs("uploads/logos", exist_ok=True)
os.makedirs("generated_docs", exist_ok=True)

# Inicializar o app
app = FastAPI(
    title="Gerador de POPs",
    description="API para geração de Procedimentos Operacionais Padrão (POPs)",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "API do Gerador de POPs está funcionando!"}

@app.post("/companies/", response_model=CompanyResponse)
def create_company(
    company_name: str = Form(...),
    primary_color: str = Form(...),
    secondary_color: str = Form(...),
    logo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Cria uma nova empresa com logo e cores personalizadas
    """
    # Validar formato do logo
    if not logo.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Formato de logo inválido. Use PNG, JPG ou JPEG.")
    
    # Gerar nome único para o arquivo
    logo_filename = f"{uuid.uuid4()}{os.path.splitext(logo.filename)[1]}"
    logo_path = f"uploads/logos/{logo_filename}"
    
    # Salvar o logo
    with open(logo_path, "wb") as buffer:
        shutil.copyfileobj(logo.file, buffer)
    
    # Criar registro da empresa
    db_company = Company(
        name=company_name,
        primary_color=primary_color,
        secondary_color=secondary_color,
        logo_path=logo_path
    )
    
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    
    return db_company

@app.get("/companies/", response_model=List[CompanyResponse])
def list_companies(db: Session = Depends(get_db)):
    """
    Lista todas as empresas cadastradas
    """
    return db.query(Company).all()

@app.post("/pops/", response_model=POPResponse)
async def create_pop(
    background_tasks: BackgroundTasks,
    company_id: int = Form(...),
    procedure_name: str = Form(...),
    pop_code: str = Form(...),
    department: str = Form(...),
    periodicity: str = Form(...),
    start_date: str = Form(...),
    target_date: Optional[str] = Form(None),
    legal_date: Optional[str] = Form(None),
    competence: str = Form(...),
    tax_regime: str = Form(...),
    complexity: str = Form(...),
    responsible: str = Form(...),
    automatic_routine: str = Form(...),
    estimated_time: str = Form(...),
    description: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Cria um novo POP e gera o documento DOCX
    """
    # Verificar se a empresa existe
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    # Criar registro do POP
    db_pop = POP(
        company_id=company_id,
        procedure_name=procedure_name,
        pop_code=pop_code,
        department=department,
        periodicity=periodicity,
        start_date=start_date,
        target_date=target_date,
        legal_date=legal_date,
        competence=competence,
        tax_regime=tax_regime,
        complexity=complexity,
        responsible=responsible,
        automatic_routine=automatic_routine,
        estimated_time=estimated_time,
        description=description,
        created_at=datetime.now()
    )
    
    db.add(db_pop)
    db.commit()
    db.refresh(db_pop)
    
    # Gerar o documento em background
    doc_filename = f"{company.name} - {pop_code} - {department} - {procedure_name}.docx"
    doc_path = f"generated_docs/{doc_filename}"
    
    # Gerar documento
    background_tasks.add_task(
        generate_pop_document,
        db_pop.id,
        company,
        doc_path,
        db
    )
    
    # Atualizar o caminho do documento no banco
    db_pop.document_path = doc_path
    db.commit()
    
    return db_pop

@app.get("/pops/", response_model=List[POPResponse])
def list_pops(db: Session = Depends(get_db)):
    """
    Lista todos os POPs cadastrados
    """
    return db.query(POP).all()

@app.get("/pops/{pop_id}", response_model=POPResponse)
def get_pop(pop_id: int, db: Session = Depends(get_db)):
    """
    Obtém detalhes de um POP específico
    """
    pop = db.query(POP).filter(POP.id == pop_id).first()
    if not pop:
        raise HTTPException(status_code=404, detail="POP não encontrado")
    return pop

@app.get("/download/{pop_id}")
def download_pop(pop_id: int, db: Session = Depends(get_db)):
    """
    Faz o download do documento DOCX gerado
    """
    pop = db.query(POP).filter(POP.id == pop_id).first()
    if not pop or not pop.document_path or not os.path.exists(pop.document_path):
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    
    return FileResponse(
        pop.document_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=os.path.basename(pop.document_path)
    )

@app.get("/preview-cover/{company_id}")
def preview_cover(company_id: int, db: Session = Depends(get_db)):
    """
    Gera uma prévia da capa do POP
    """
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    # Implementar geração de prévia da capa (imagem)
    # Esta funcionalidade será implementada no módulo docx_generator
    
    # Por enquanto, retornar o logo da empresa
    if os.path.exists(company.logo_path):
        return FileResponse(company.logo_path)
    else:
        raise HTTPException(status_code=404, detail="Logo não encontrado")

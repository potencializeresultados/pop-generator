FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Criar diretórios necessários
RUN mkdir -p uploads/logos uploads/previews generated_docs

# Expor a porta que o FastAPI usará
EXPOSE 8000

# Comando para iniciar o servidor
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

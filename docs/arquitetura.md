# Arquitetura do Sistema de Geração de POPs

## Visão Geral

O sistema de geração de POPs (Procedimento Operacional Padrão) é uma aplicação web que permite aos usuários preencher formulários com dados de procedimentos operacionais e gerar automaticamente documentos DOCX formatados conforme um modelo predefinido. A aplicação segue uma arquitetura cliente-servidor, com frontend em React e backend em FastAPI.

## Componentes Principais

### 1. Frontend (React + Tailwind CSS)

- **Tecnologias**: React, Tailwind CSS, Vite
- **Esquema de Cores**: Vermelho, branco e preto
- **Componentes Principais**:
  - Formulário de entrada de dados do POP
  - Visualizador de prévia da capa
  - Interface de upload de logotipo
  - Seletor de cores da empresa
  - Barra de progresso para geração do documento
  - Área de download do documento gerado

### 2. Backend (FastAPI)

- **Tecnologias**: Python 3.12, FastAPI
- **Funcionalidades**:
  - API RESTful para receber dados do formulário
  - Processamento e validação de dados
  - Geração de documentos DOCX usando python-docx/docxtpl
  - Armazenamento de dados em SQLite
  - Endpoint para download de documentos gerados

### 3. Banco de Dados (SQLite)

- **Esquema**:
  - Tabela de POPs (armazenamento de metadados e conteúdo)
  - Tabela de Empresas (nome, logotipo, cores)
  - Tabela de Usuários (opcional, para autenticação)

### 4. Sistema de Geração de Documentos

- **Tecnologias**: python-docx, docxtpl
- **Funcionalidades**:
  - Template base em DOCX
  - Substituição de variáveis no template
  - Formatação conforme regras definidas
  - Geração de capa personalizada com cores e logotipo da empresa

## Fluxo de Dados

1. Usuário preenche o formulário no frontend e faz upload do logotipo
2. Frontend valida os dados e envia para o backend via API
3. Backend processa os dados, valida e armazena no banco de dados SQLite
4. Backend gera o documento DOCX usando o template e os dados fornecidos
5. Backend retorna o link para download do documento gerado
6. Usuário baixa o documento pelo frontend

## Diagrama de Componentes

```
+------------------+       +------------------+       +------------------+
|                  |       |                  |       |                  |
|     Frontend     |------>|     Backend      |------>|   Banco de Dados |
|    (React+Vite)  |       |    (FastAPI)     |       |     (SQLite)     |
|                  |<------|                  |<------|                  |
+------------------+       +------------------+       +------------------+
                                   |
                                   v
                           +------------------+
                           |                  |
                           | Gerador de DOCX  |
                           | (python-docx)    |
                           |                  |
                           +------------------+
```

## Requisitos Técnicos

### Frontend
- Node.js 20.x
- React 18.x
- Tailwind CSS 3.x
- Vite 5.x

### Backend
- Python 3.12
- FastAPI
- python-docx/docxtpl
- SQLite

### Containerização
- Docker
- docker-compose

## Estrutura de Diretórios

```
/pop_generator/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── schemas.py
│   │   └── docx_generator.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── templates/
│   └── POP_base.docx
├── docs/
│   ├── arquitetura.md
│   └── api_docs.md
└── docker-compose.yml
```

## Considerações de Segurança

- Validação de entrada de dados no frontend e backend
- Sanitização de nomes de arquivos
- Limitação de tamanho de upload de arquivos
- Proteção contra injeção SQL
- Controle de acesso aos endpoints da API (opcional)

## Escalabilidade

- O sistema é projetado para ser executado em contêineres Docker, facilitando a implantação e escalabilidade
- O banco de dados SQLite é adequado para uso em pequena escala; para maior escala, pode ser substituído por PostgreSQL com mínimas alterações no código

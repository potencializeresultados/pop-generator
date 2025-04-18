# Gerador de POPs

Sistema para geração automatizada de Procedimentos Operacionais Padrão (POPs) em formato DOCX.

## Visão Geral

O Gerador de POPs é uma aplicação web completa que permite aos usuários:

1. Cadastrar empresas com logotipos e cores personalizadas
2. Criar POPs através de um formulário intuitivo
3. Gerar documentos DOCX formatados automaticamente
4. Visualizar e baixar os POPs gerados

## Tecnologias Utilizadas

### Backend
- Python 3.12
- FastAPI
- SQLite
- python-docx

### Frontend
- React 18
- Tailwind CSS
- Vite

### Infraestrutura
- Docker
- Nginx

## Estrutura do Projeto

```
/pop_generator/
├── backend/               # API FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py        # Endpoints da API
│   │   ├── models.py      # Modelos SQLAlchemy
│   │   ├── database.py    # Configuração do banco de dados
│   │   ├── schemas.py     # Schemas Pydantic
│   │   └── docx_generator.py  # Geração de documentos DOCX
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/              # Interface React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Ponto de entrada
│   ├── package.json
│   ├── tailwind.config.js
│   ├── nginx.conf
│   └── Dockerfile
├── templates/             # Templates DOCX
│   └── POP_base.docx      # Template base para geração de POPs
├── docs/                  # Documentação
│   ├── arquitetura.md     # Documentação da arquitetura
│   └── api_docs.md        # Documentação da API
└── docker-compose.yml     # Configuração Docker Compose
```

## Instalação e Execução

### Pré-requisitos
- Docker
- Docker Compose

### Passos para Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pop-generator.git
cd pop-generator
```

2. Inicie os contêineres:
```bash
docker-compose up -d
```

3. Acesse a aplicação:
```
http://localhost
```

## Uso da Aplicação

1. **Cadastro de Empresa**
   - Acesse "Nova Empresa" no menu
   - Preencha o nome da empresa
   - Selecione as cores primária e secundária
   - Faça upload do logotipo
   - Clique em "Cadastrar Empresa"

2. **Criação de POP**
   - Acesse "Novo POP" no menu
   - Selecione a empresa
   - Preencha todos os campos do formulário
   - Escreva a descrição do procedimento
   - Clique em "Gerar POP"

3. **Visualização e Download**
   - Acesse "Listar POPs" no menu
   - Visualize todos os POPs gerados
   - Clique em "Baixar" para obter o arquivo DOCX

## Desenvolvimento Local

### Backend

1. Instale as dependências:
```bash
cd backend
pip install -r requirements.txt
```

2. Execute o servidor:
```bash
uvicorn app.main:app --reload
```

### Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

## API

A documentação completa da API está disponível em `/docs/api_docs.md`.

Endpoints principais:
- `POST /companies/` - Criar empresa
- `GET /companies/` - Listar empresas
- `POST /pops/` - Criar POP
- `GET /pops/` - Listar POPs
- `GET /download/{pop_id}` - Baixar documento DOCX

## Personalização

### Template DOCX

Para personalizar o template base:
1. Modifique o arquivo `/templates/POP_base.docx`
2. Ajuste o código em `docx_generator.py` conforme necessário

### Cores e Estilos

Para alterar o esquema de cores:
1. Modifique as variáveis em `/frontend/src/index.css`
2. Ajuste o tema em `/frontend/tailwind.config.js`

## Implantação em Produção

### Vercel (Frontend)

1. Configure o projeto no Vercel
2. Defina a variável de ambiente `VITE_API_URL` com o URL do backend

### Render (Backend)

1. Configure o serviço web no Render
2. Use o Dockerfile do backend
3. Configure volumes persistentes para armazenamento de arquivos

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

Para suporte ou dúvidas, entre em contato através de [seu-email@exemplo.com](mailto:seu-email@exemplo.com).

# API do Gerador de POPs

Esta documentação descreve os endpoints disponíveis na API do Gerador de POPs.

## Base URL

```
http://localhost:8000
```

## Endpoints

### Verificação de Status

```
GET /
```

Verifica se a API está funcionando.

**Resposta de Sucesso:**
```json
{
  "message": "API do Gerador de POPs está funcionando!"
}
```

### Empresas

#### Criar Empresa

```
POST /companies/
```

Cria uma nova empresa com logo e cores personalizadas.

**Parâmetros do Formulário:**
- `company_name` (string, obrigatório): Nome da empresa
- `primary_color` (string, obrigatório): Cor primária em formato hexadecimal (ex: #FF0000)
- `secondary_color` (string, obrigatório): Cor secundária em formato hexadecimal (ex: #000000)
- `logo` (arquivo, obrigatório): Arquivo de imagem do logotipo (PNG, JPG ou JPEG)

**Resposta de Sucesso:**
```json
{
  "id": 1,
  "name": "Empresa Exemplo",
  "primary_color": "#FF0000",
  "secondary_color": "#000000",
  "logo_path": "uploads/logos/12345678-1234-5678-1234-567812345678.png",
  "created_at": "2025-04-18T14:30:00.000Z"
}
```

#### Listar Empresas

```
GET /companies/
```

Lista todas as empresas cadastradas.

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "name": "Empresa Exemplo",
    "primary_color": "#FF0000",
    "secondary_color": "#000000",
    "logo_path": "uploads/logos/12345678-1234-5678-1234-567812345678.png",
    "created_at": "2025-04-18T14:30:00.000Z"
  }
]
```

### POPs

#### Criar POP

```
POST /pops/
```

Cria um novo POP e gera o documento DOCX.

**Parâmetros do Formulário:**
- `company_id` (int, obrigatório): ID da empresa
- `procedure_name` (string, obrigatório): Nome do procedimento
- `pop_code` (string, obrigatório): Código do POP
- `department` (string, obrigatório): Departamento
- `periodicity` (string, obrigatório): Periodicidade
- `start_date` (string, obrigatório): Data de início
- `target_date` (string, opcional): Data meta
- `legal_date` (string, opcional): Data legal
- `competence` (string, obrigatório): Competência
- `tax_regime` (string, obrigatório): Regime tributário
- `complexity` (string, obrigatório): Complexidade
- `responsible` (string, obrigatório): Responsável
- `automatic_routine` (string, obrigatório): Rotina automática/lote
- `estimated_time` (string, obrigatório): Tempo médio estimado
- `description` (string, obrigatório): Descrição do procedimento

**Resposta de Sucesso:**
```json
{
  "id": 1,
  "company_id": 1,
  "procedure_name": "Importação de Notas Fiscais",
  "pop_code": "FIS.01",
  "department": "Fiscal",
  "periodicity": "Mensal",
  "start_date": "2025-04-01",
  "target_date": "2025-04-15",
  "legal_date": "2025-04-20",
  "competence": "Mês Anterior",
  "tax_regime": "Simples Nacional",
  "complexity": "Média",
  "responsible": "Analista",
  "automatic_routine": "Existe",
  "estimated_time": "01:30",
  "description": "Acessar o sistema de captura de notas fiscais;...",
  "document_path": "generated_docs/Empresa Exemplo - FIS.01 - Fiscal - Importação de Notas Fiscais.docx",
  "created_at": "2025-04-18T14:35:00.000Z"
}
```

#### Listar POPs

```
GET /pops/
```

Lista todos os POPs cadastrados.

**Resposta de Sucesso:**
```json
[
  {
    "id": 1,
    "company_id": 1,
    "procedure_name": "Importação de Notas Fiscais",
    "pop_code": "FIS.01",
    "department": "Fiscal",
    "periodicity": "Mensal",
    "start_date": "2025-04-01",
    "target_date": "2025-04-15",
    "legal_date": "2025-04-20",
    "competence": "Mês Anterior",
    "tax_regime": "Simples Nacional",
    "complexity": "Média",
    "responsible": "Analista",
    "automatic_routine": "Existe",
    "estimated_time": "01:30",
    "description": "Acessar o sistema de captura de notas fiscais;...",
    "document_path": "generated_docs/Empresa Exemplo - FIS.01 - Fiscal - Importação de Notas Fiscais.docx",
    "created_at": "2025-04-18T14:35:00.000Z"
  }
]
```

#### Obter POP

```
GET /pops/{pop_id}
```

Obtém detalhes de um POP específico.

**Parâmetros de URL:**
- `pop_id` (int, obrigatório): ID do POP

**Resposta de Sucesso:**
```json
{
  "id": 1,
  "company_id": 1,
  "procedure_name": "Importação de Notas Fiscais",
  "pop_code": "FIS.01",
  "department": "Fiscal",
  "periodicity": "Mensal",
  "start_date": "2025-04-01",
  "target_date": "2025-04-15",
  "legal_date": "2025-04-20",
  "competence": "Mês Anterior",
  "tax_regime": "Simples Nacional",
  "complexity": "Média",
  "responsible": "Analista",
  "automatic_routine": "Existe",
  "estimated_time": "01:30",
  "description": "Acessar o sistema de captura de notas fiscais;...",
  "document_path": "generated_docs/Empresa Exemplo - FIS.01 - Fiscal - Importação de Notas Fiscais.docx",
  "created_at": "2025-04-18T14:35:00.000Z"
}
```

#### Download do Documento

```
GET /download/{pop_id}
```

Faz o download do documento DOCX gerado.

**Parâmetros de URL:**
- `pop_id` (int, obrigatório): ID do POP

**Resposta de Sucesso:**
- Arquivo DOCX para download

### Pré-visualização

```
GET /preview-cover/{company_id}
```

Gera uma prévia da capa do POP.

**Parâmetros de URL:**
- `company_id` (int, obrigatório): ID da empresa

**Resposta de Sucesso:**
- Imagem do logotipo da empresa ou prévia da capa

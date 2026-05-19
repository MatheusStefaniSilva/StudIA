# StudIA

<p align="center">
  <img src="https://img.shields.io/badge/version-0.0.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="License" />
</p>
<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.5-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.0.10-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>
Aplicação web que utiliza IA para gerar questões personalizadas sobre temas de tecnologia, design, negócios e mais. O usuário escolhe um tópico e subtópico, define a quantidade de questões e inicia um quiz gerado dinamicamente pelo Gemini.

---

## Funcionalidades

- Seleção de tópico e subtópico via carrossel interativo
- Geração de questões com IA (Gemini)
- Configuração do número de questões por sessão
- Página de gerenciamento de tópicos e subtópicos (CRUD completo)
- Backend REST com Node.js, Express e Prisma
- Banco de dados MongoDB

---

## Estrutura do Projeto

```
StudIA/
├── frontend/          # React + Vite
│   └── src/
│       ├── pages/
│       │   ├── home/          # Tela principal com seleção de tópico
│       │   ├── quiz/          # Tela do quiz gerado pela IA
│       │   └── settings/      # Gerenciamento de tópicos e subtópicos
│       └── services/
│           └── api.js         # Configuração do axios
│
└── backend/           # Node.js + Express + Prisma
    ├── src/
    │   ├── controllers/       # Lógica das rotas
    │   ├── routes/            # Definição das rotas
    │   └── util/
    │       └── prisma.js      # Instância do Prisma Client
    └── prisma/
        └── schema.prisma      # Modelos Topic e Subtopic
```

---

## Tecnologias

**Frontend**
- React 18
- React Router DOM
- Vite
- Axios

**Backend**
- Node.js
- Express
- Prisma ORM
- MongoDB

---

## Pré-requisitos

- Node.js 18+
- Conta MongoDB Atlas (ou instância local)
- Chave de API do Gemini

---

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/StudIA.git
cd StudIA
```

### 2. Configure o backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/studia"
PORT=4000
```

Gere o Prisma Client e popule o banco:

```bash
npx prisma generate
npx prisma db push
npm run seed
```

Inicie o servidor:

```bash
npm run dev
```

### 3. Configure o frontend

```bash
cd ../frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/topics` | Lista todos os tópicos com subtópicos |
| POST | `/topics` | Cria um novo tópico |
| PUT | `/topics/:id` | Atualiza um tópico |
| DELETE | `/topics/:id` | Remove um tópico e seus subtópicos |
| POST | `/topics/:topicId/subtopics` | Cria um subtópico |
| PUT | `/subtopic/:topicId/:subtopicId` | Atualiza um subtópico |
| DELETE | `/subtopic/:topicId/:subtopicId` | Remove um subtópico |

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | String de conexão com o MongoDB |
| `PORT` | Porta do servidor backend (padrão: 4000) |

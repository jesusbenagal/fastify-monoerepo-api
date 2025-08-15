# Fastify API

Modern API project in Node.js with a pnpm workspaces monorepo.

## 🚀 Tech Stack

- Backend: Fastify + TypeScript
- Database: PostgreSQL + Prisma ORM
- Authentication: JWT
- Validation: Zod
- File uploads: @fastify/multipart
- Real-time: Socket.IO
- Docs: Swagger + Swagger UI
- Testing: Jest + Supertest
- Security: CORS, rate limiting, security headers
- Monorepo: `packages/api`, `packages/db`, `packages/shared`

---

## ✨ Recent improvements

- Centralized error handling with specific error types (AuthenticationError, AuthorizationError, NotFoundError, ConflictError)
- Global error handler returns standardized responses
- JWT middleware logs verification and enforces auth/roles
- Socket.IO initialized via helper; mocked in tests when not available
- Posts creation returns 201 status code
- Tests run in series to avoid DB race conditions (Jest maxWorkers: 1)

---

## 📂 Monorepo structure

```
.
├─ packages/
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ lib/
│  │  │  ├─ modules/
│  │  │  ├─ plugins/
│  │  │  └─ tests/
│  ├─ db/
│  └─ shared/
├─ docker-compose.yml
├─ tsconfig.base.json
└─ README.md
```

---

## 🛠 Setup

### Prerequisites
- Node.js >= 20
- pnpm >= 9
- Docker (for local PostgreSQL)

### Install
```bash
pnpm install
```

### Database
```bash
docker compose up -d
pnpm -C packages/db generate
pnpm -C packages/db migrate
```

### Environment
Copy `packages/api/env.example` to `packages/api/.env` and set:
```env
PORT=3000
HOST=localhost
NODE_ENV=development
LOG_LEVEL=info
JWT_SECRET=your-secret
JWT_EXPIRES_IN=24h
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb?schema=public"
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=60000
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

---

## ▶️ Development
```bash
pnpm dev
pnpm lint
pnpm format
pnpm test
```
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Health: GET /health

---

## 🔑 Endpoints

### Auth
- POST /auth/register
- POST /auth/login

### Users
- GET /users/me
- GET /users
- GET /users/:id
- PATCH /users/:id
- DELETE /users/:id (admin only)
- POST /users/:id/avatar

### Posts
- GET /posts (optional `authorId`)
- POST /posts (auth required)

---

## 📡 Socket.IO events
- user:update
- user:avatar
- post:create

---

## 🧪 Tests
```bash
pnpm test
pnpm test:coverage
```
Notes:
- Tests run in series (Jest `maxWorkers: 1`) to avoid DB race conditions.
- Error responses return specific error types in `error`.

---

## 🔧 Scripts
```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm test
pnpm test:coverage
pnpm db:studio
pnpm db:migrate
pnpm db:deploy
```

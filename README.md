# Node Advanced Test (Monorepo)

Proyecto de prueba técnica en **Node.js** con arquitectura **monorepo** usando **pnpm workspaces**.

## 🚀 Stack Tecnológico

- **Backend**: [Fastify](https://fastify.dev/) + **TypeScript**
- **Base de datos**: PostgreSQL + [Prisma ORM](https://www.prisma.io/)
- **Autenticación**: JWT (Json Web Token)
- **Validación**: [Zod](https://zod.dev/)
- **Subida de archivos**: @fastify/multipart (almacenamiento local)
- **Notificaciones en tiempo real**: [Socket.IO](https://socket.io/)
- **Documentación**: Swagger + Swagger UI
- **Testing**: Jest + Supertest
- **Monorepo**: `packages/api`, `packages/db`, `packages/shared`

---

## 📂 Estructura del Monorepo

.
├─ packages/
│ ├─ api/ # Aplicación Fastify (HTTP + WS)
│ ├─ db/ # Esquema Prisma + cliente
│ └─ shared/ # Tipos y utilidades compartidas
├─ docker-compose.yml # Postgres local
├─ tsconfig.base.json # Configuración base TypeScript
└─ README.md

---

## 🛠 Instalación y Configuración Local

### 1. Requisitos previos

- Node.js >= 20
- pnpm >= 9
- Docker (para levantar Postgres localmente)

### 2. Clonar e instalar dependencias

git clone <REPO_URL>
cd node-advanced-test
pnpm install

### 3. Levantar base de datos

docker compose up -d

### 4. Generar cliente Prisma y aplicar migraciones

pnpm -C packages/db generate
pnpm -C packages/db migrate

### 5. Variables de entorno

**packages/api/.env**
PORT=3000
JWT_SECRET=supersecret_dev_change_me

**packages/db/.env**
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb?schema=public"

---

## ▶️ Ejecución en desarrollo

pnpm dev

- API corriendo en: http://localhost:3000
- Swagger UI: http://localhost:3000/docs
- Healthcheck: GET /health

---

## 🔑 Endpoints Principales

### Auth

- POST /auth/register → Registro de usuario
- POST /auth/login → Login (devuelve accessToken)

### Usuarios

- GET /users/me → Info de usuario logueado
- PATCH /users/:id → Actualizar perfil (autorización requerida)
- DELETE /users/:id → Solo ADMIN
- POST /users/:id/avatar → Subir avatar (multipart)

### Posts

- GET /posts → Listar posts (opcional authorId)
- POST /posts → Crear post (requiere login)

---

## 📡 Eventos Socket.IO

Conéctate a ws://localhost:3000 y escucha:

- user:updated → Perfil actualizado
- user:avatar → Avatar cambiado
- post:created → Post creado

---

## 🧪 Tests

Ejecutar todos los tests (Jest + Supertest):

pnpm -C packages/api test

---

## 📦 Deploy con Docker

### Build de la API

docker build -t node-advanced-test-api ./packages/api

### Ejecutar

docker run -p 3000:3000 --env-file packages/api/.env node-advanced-test-api

---

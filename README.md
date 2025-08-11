# Fastify API - Proyecto Mejorado

Proyecto de API moderna en **Node.js** con arquitectura **monorepo** usando **pnpm workspaces**.

## 🚀 Stack Tecnológico

- **Backend**: [Fastify](https://fastify.dev/) + **TypeScript**
- **Base de datos**: PostgreSQL + [Prisma ORM](https://www.prisma.io/)
- **Autenticación**: JWT (Json Web Token) con configuración mejorada
- **Validación**: [Zod](https://zod.dev/) con esquemas centralizados
- **Subida de archivos**: @fastify/multipart con validación mejorada
- **Notificaciones en tiempo real**: [Socket.IO](https://socket.io/)
- **Documentación**: Swagger + Swagger UI con documentación completa
- **Testing**: Jest + Supertest con cobertura mejorada
- **Seguridad**: Helmet, Rate Limiting, CORS configurado
- **Monorepo**: `packages/api`, `packages/db`, `packages/shared`

---

## ✨ Mejoras Implementadas

### 🔒 Seguridad

- **Helmet**: Headers de seguridad configurados
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS**: Configuración específica y segura
- **JWT**: Configuración mejorada con expiración y validación

### 📝 Validación y Manejo de Errores

- **Esquemas Zod centralizados**: Validación consistente en toda la API
- **Manejo de errores global**: Respuestas de error estandarizadas
- **Validación de entrada**: Mejor validación de datos de entrada
- **Tipos TypeScript**: Tipos derivados automáticamente de esquemas

### 🧪 Testing

- **Tests mejorados**: Mayor cobertura y casos de prueba más completos
- **Utilidades de testing**: Funciones helper para crear datos de prueba
- **Validación de respuestas**: Verificación de estructura de respuestas

### 📚 Documentación

- **Swagger mejorado**: Documentación completa con ejemplos
- **Esquemas de respuesta**: Documentación detallada de respuestas
- **Tags organizados**: Endpoints agrupados por funcionalidad

### 🛠️ Desarrollo

- **ESLint + Prettier**: Configuración para código limpio
- **Scripts mejorados**: Comandos para linting, formateo y testing
- **Variables de entorno**: Configuración centralizada

---

## 📂 Estructura del Monorepo

```
.
├─ packages/
│ ├─ api/ # Aplicación Fastify (HTTP + WS)
│ │ ├─ src/
│ │ │ ├─ lib/ # Utilidades y configuración
│ │ │ │ ├─ errors.ts # Manejo centralizado de errores
│ │ │ │ ├─ validation.ts # Esquemas de validación
│ │ │ │ └─ ...
│ │ │ ├─ modules/ # Módulos de la aplicación
│ │ │ ├─ plugins/ # Plugins de Fastify
│ │ │ │ ├─ security.ts # Configuración de seguridad
│ │ │ │ └─ ...
│ │ │ └─ tests/ # Tests con mejor cobertura
│ ├─ db/ # Esquema Prisma + cliente
│ └─ shared/ # Tipos y utilidades compartidas
├─ docker-compose.yml # Postgres local
├─ tsconfig.base.json # Configuración base TypeScript
└─ README.md
```

---

## 🛠 Instalación y Configuración Local

### 1. Requisitos previos

- Node.js >= 20
- pnpm >= 9
- Docker (para levantar Postgres localmente)

### 2. Clonar e instalar dependencias

```bash
git clone <REPO_URL>
cd fastify-api
pnpm install
```

### 3. Levantar base de datos

```bash
docker compose up -d
```

### 4. Generar cliente Prisma y aplicar migraciones

```bash
pnpm -C packages/db generate
pnpm -C packages/db migrate
```

### 5. Variables de entorno

Copia `packages/api/env.example` a `packages/api/.env` y configura:

```env
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development
LOG_LEVEL=info

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/appdb?schema=public"

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=60000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

---

## ▶️ Ejecución en desarrollo

```bash
# Desarrollo con recarga automática
pnpm dev                    # tsx con watch (recomendado)
pnpm dev:fast              # tsx con watch sin limpiar pantalla
pnpm dev:nodemon           # nodemon con configuración personalizada
pnpm dev:full              # desarrollo + linting en tiempo real

# Linting
pnpm lint                  # verificar código
pnpm lint:fix             # corregir problemas automáticamente
pnpm lint:watch           # linting en tiempo real

# Formateo
pnpm format               # formatear código
pnpm format:check         # verificar formato

# Tests
pnpm test                 # ejecutar tests
pnpm test:watch          # tests en modo watch
pnpm test:coverage       # tests con cobertura
```

- API corriendo en: http://localhost:3000
- Swagger UI: http://localhost:3000/docs
- Healthcheck: GET /health

### 🔄 Opciones de Desarrollo

- **`pnpm dev`**: Recarga automática con `tsx --watch` (más rápido)
- **`pnpm dev:fast`**: Igual que `dev` pero sin limpiar la pantalla
- **`pnpm dev:nodemon`**: Usando nodemon con configuración personalizada
- **`pnpm dev:full`**: Desarrollo + linting en tiempo real (requiere `concurrently`)

---

## 🔑 Endpoints Principales

### Auth

- `POST /auth/register` → Registro de usuario (validación mejorada)
- `POST /auth/login` → Login (devuelve accessToken + info de usuario)

### Usuarios

- `GET /users/me` → Info de usuario logueado
- `GET /users` → Listar todos los usuarios
- `GET /users/:id` → Obtener usuario por ID
- `PATCH /users/:id` → Actualizar perfil (autorización requerida)
- `DELETE /users/:id` → Solo ADMIN
- `POST /users/:id/avatar` → Subir avatar (multipart con validación)

### Posts

- `GET /posts` → Listar posts (opcional authorId)
- `POST /posts` → Crear post (requiere login)

---

## 📡 Eventos Socket.IO

Conéctate a `ws://localhost:3000` y escucha:

- `user:update` → Perfil actualizado
- `user:avatar` → Avatar cambiado
- `post:create` → Post creado

---

## 🧪 Tests

Ejecutar todos los tests con cobertura:

```bash
pnpm test:coverage
```

### Cobertura de Tests

- ✅ Autenticación (registro, login, validación)
- ✅ Usuarios (CRUD, autorización, avatar)
- ✅ Posts (creación, listado, filtros)
- ✅ Validación de entrada
- ✅ Manejo de errores
- ✅ Autorización y permisos

---

## 📦 Deploy con Docker

### Build de la API

```bash
docker build -t fastify-api ./packages/api
```

### Ejecutar

```bash
docker run -p 3000:3000 --env-file packages/api/.env fastify-api
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev                    # Desarrollo con recarga automática (tsx)
pnpm dev:fast              # Desarrollo sin limpiar pantalla
pnpm dev:nodemon           # Desarrollo con nodemon
pnpm dev:full              # Desarrollo + linting en tiempo real
pnpm build                 # Build de producción
pnpm start                 # Iniciar servidor de producción

# Calidad de código
pnpm lint                  # Verificar linting
pnpm lint:fix             # Corregir problemas de linting
pnpm lint:watch           # Linting en tiempo real
pnpm format               # Formatear código
pnpm format:check         # Verificar formato

# Testing
pnpm test                  # Ejecutar tests
pnpm test:watch           # Tests en modo watch
pnpm test:coverage        # Tests con cobertura

# Base de datos
pnpm db:studio            # Abrir Prisma Studio
pnpm db:migrate           # Aplicar migraciones
pnpm db:deploy            # Deploy de migraciones
```

---

## 🚀 Próximas Mejoras Sugeridas

1. **Cache**: Implementar Redis para cache
2. **Logging**: Configurar logging estructurado
3. **Métricas**: Agregar métricas con Prometheus
4. **CI/CD**: Configurar pipeline de integración continua
5. **Monitoreo**: Implementar health checks avanzados
6. **Compresión**: Agregar compresión de respuestas
7. **Validación**: Validación de archivos más robusta
8. **Tests E2E**: Agregar tests end-to-end

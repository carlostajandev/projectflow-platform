# Codemized Challenge — Full-Stack Project Management App

A full-stack project management application built with **NestJS**, **Next.js**, and **PostgreSQL**, containerized with Docker Compose.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | NestJS, TypeORM, Passport JWT |
| **Database** | PostgreSQL 16 |
| **Auth** | JWT + bcryptjs |
| **Validation** | class-validator (BE) · Zod + React Hook Form (FE) |
| **Testing** | Jest + @nestjs/testing (unit tests) |
| **Package Manager** | pnpm |
| **Infra** | Docker Compose, multi-stage Dockerfiles |

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose v2+
- [pnpm](https://pnpm.io/) v8+

### Run the application

```bash
# 1. Clone the repo
git clone <repo-url>
cd projectflow-platform

# 2. Copy environment variables
cp .env.example .env.development

# 3. Start all services
docker compose up
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api/v1 |
| Swagger Docs | http://localhost:3001/api/docs |

> The backend waits for PostgreSQL to be healthy before starting. No manual DB setup needed — TypeORM handles schema creation automatically on first run.

### Run locally (without Docker)

```bash
# Start only the database
docker compose up postgres -d

# Backend
cd codemized-backend
pnpm install
pnpm start:dev

# Frontend (in a separate terminal)
cd codemized-frontend
pnpm install
pnpm dev
```

---

## Seed Data

To populate the database with sample users, projects, tasks and comments, run the seed script after the backend has started at least once (so TypeORM can create the tables):

```bash
# From the project root
docker exec -i codemized_db psql -U codemized -d codemized_db < codemized-backend/src/database/seed.sql
```

Or from inside `codemized-backend/` using the pnpm script:

```bash
pnpm seed
```

### Demo Users

All users share the same password: **`password`**

| Name | Email | Role |
|---|---|---|
| Carlos Admin | admin@projectflow.com | Creator of ProjectFlow App & Mobile App MVP |
| Ana García | ana@projectflow.com | Creator of E-Commerce Redesign |
| Luis Martínez | luis@projectflow.com | Assignee on several tasks |
| Sofía López | sofia@projectflow.com | Assignee on mobile tasks |

---

## Testing

Unit tests are written with **Jest** and **@nestjs/testing**. All service methods are tested in isolation using mocked repositories and dependencies — no database required.

```bash
cd codemized-backend

# Run all tests
pnpm test

# Run with coverage report
pnpm test:cov

# Watch mode
pnpm test:watch
```

### Test coverage

| File | Tests | What's covered |
|---|---|---|
| `auth.service.spec.ts` | 5 | register, login, duplicate email, wrong password, user not found |
| `projects.service.spec.ts` | 6 | create, findAll, findById, ownership check, update, delete |
| `tasks.service.spec.ts` | 7 | create, findByProject, findById, update, assign, assign not found, delete |

---

## Architecture

```
projectflow-platform/
├── docker-compose.yml
├── .env.example
├── codemized-backend/          # NestJS API
│   └── src/
│       ├── modules/
│       │   ├── auth/           # JWT auth, guards, strategies, decorators
│       │   ├── users/          # User entity + CRUD
│       │   ├── projects/       # Project management
│       │   ├── tasks/          # Task management with status/priority
│       │   ├── comments/       # Task comments
│       │   └── health/         # Health check endpoint
│       ├── common/
│       │   ├── filters/        # Global HTTP exception filter
│       │   ├── interceptors/   # Global response wrapper interceptor
│       │   ├── exceptions/     # Custom business exceptions
│       │   └── dto/            # Shared DTOs (ApiResponseDto)
│       ├── config/             # TypeORM / environment config
│       └── database/
│           └── seed.sql        # Sample data for local development
│
└── codemized-frontend/         # Next.js App Router
    └── src/
        ├── app/
        │   ├── auth/           # Login & Register pages
        │   └── dashboard/      # Protected dashboard with Kanban board
        ├── components/         # Reusable UI components
        ├── hooks/              # Custom hooks (useProjects, useTasks)
        ├── lib/
        │   ├── api/            # Axios client + service layer
        │   ├── store/          # Zustand auth store
        │   └── validations/    # Zod schemas
        └── types/              # Shared TypeScript types
```

### Backend Design Principles

- **Layered architecture**: Controller → Service → Repository
- **Global response wrapper**: All endpoints return `{ success, data, message, statusCode }`
- **Global exception filter**: Centralized error handling with structured error responses
- **Custom exceptions**: Domain-specific exceptions (`ProjectNotFoundException`, `EmailAlreadyExistsException`, etc.)
- **DTOs with validation**: `class-validator` decorators on all incoming payloads
- **`@CurrentUser()` decorator**: Clean access to the authenticated user in any controller
- **Ownership guards**: Users can only modify their own projects/tasks
- **Swagger/OpenAPI**: Full API documentation at `/api/docs`

### Frontend Design Principles

- **App Router**: Next.js 14 with proper layout segmentation
- **Auth guard**: Dashboard layout protects all routes, redirects to login
- **Axios interceptors**: Automatic JWT injection + 401 global redirect
- **Zustand**: Lightweight auth state with persistence
- **Zod + React Hook Form**: Type-safe form validation
- **Custom hooks**: `useProjects` and `useTasks` encapsulate all data-fetching logic
- **Loading skeletons**: All async content shows skeleton loaders

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |
| GET | `/api/v1/auth/me` | Get current user 🔒 |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/projects` | Create a project 🔒 |
| GET | `/api/v1/projects` | List my projects 🔒 |
| GET | `/api/v1/projects/:id` | Get project by ID 🔒 |
| PUT | `/api/v1/projects/:id` | Update project 🔒 |
| DELETE | `/api/v1/projects/:id` | Delete project 🔒 |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/projects/:projectId/tasks` | Create task 🔒 |
| GET | `/api/v1/projects/:projectId/tasks` | List tasks by project 🔒 |
| PUT | `/api/v1/projects/:projectId/tasks/:id` | Update task 🔒 |
| PATCH | `/api/v1/projects/:projectId/tasks/:id/assign` | Assign task to user 🔒 |
| DELETE | `/api/v1/projects/:projectId/tasks/:id` | Delete task 🔒 |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/tasks/:taskId/comments` | Add comment 🔒 |
| GET | `/api/v1/tasks/:taskId/comments` | List comments 🔒 |
| DELETE | `/api/v1/tasks/:taskId/comments/:id` | Delete comment 🔒 |

🔒 = Requires `Authorization: Bearer <token>`

---

## Data Model

```
User (1) ─────────── (N) Project
User (1) ─────────── (N) Task (assignee)
User (1) ─────────── (N) Comment (author)
Project (1) ──────── (N) Task
Task (1) ─────────── (N) Comment
```

---

## Environment Variables

See `.env.example` in the root directory. All variables have sensible defaults for local development.

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_USER` | Database user | `codemized` |
| `POSTGRES_PASSWORD` | Database password | `codemized_pass` |
| `POSTGRES_DB` | Database name | `codemized_db` |
| `JWT_SECRET` | Secret for signing JWTs | *(set in .env)* |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` |
| `NEXT_PUBLIC_API_URL` | Backend URL for frontend | `http://localhost:3001` |
# Task Management System

A full - stack Task Management System built for the Koncepthive Full Stack Web
Developer Intern technical assessment.Users log in with a fixed admin
account and manage tasks(create, view, update, delete) with search,
filtering, sorting, and a dashboard summary.

## Project Overview

The app has two parts, developed and deployed independently:

- ** frontend/** — Next.js (App Router) + TypeScript UI: login, dashboard,
  and task management screens.
- **backend/** — Express + TypeScript REST API: authentication and task
  CRUD, backed by PostgreSQL via Prisma.

```
project/
├── frontend/   # Next.js + TypeScript + Tailwind
├── backend/    # Node.js + Express + TypeScript + Prisma
├── database/   # Notes on schema/migrations (see backend/prisma)
└── README.md
```

## Technology Stack

| Layer      | Choice                                             |
| ---------- | --------------------------------------------------- |
| Frontend   | Next.js 14 (App Router), TypeScript, Tailwind CSS   |
| Backend    | Node.js, Express 4, TypeScript                      |
| Database   | PostgreSQL                                          |
| ORM        | Prisma                                              |
| Auth       | JWT (bcrypt-hashed password, stateless tokens)      |
| Validation | Zod (shared shape of rules, enforced on both ends)  |
| Toasts     | Sonner                                              |

## Installation Instructions

Prerequisites: Node.js 18+, npm, and a running PostgreSQL instance (local or
hosted, e.g. a free Supabase/Neon/Render Postgres).

```bash
# from the project root
cd backend && npm install
cd ../frontend && npm install
```

## Environment Variables

Copy each `.env.example` to `.env` and fill in real values.

**backend/.env**
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/task_management?schema=public"
JWT_SECRET="replace-with-a-long-random-string"
JWT_EXPIRES_IN="1d"
PORT=5000
CLIENT_URL="http://localhost:3000"
```

**frontend/.env**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Database Setup

From `backend/`:

```bash
npx prisma generate       # generate the Prisma client
npx prisma migrate deploy # apply the included migration (creates users & tasks tables)
npm run prisma:seed       # seeds the default admin user
```

(For local development, `npx prisma migrate dev` also works and will offer
to create the database if it doesn't exist yet.)

Default login credentials (seeded automatically):

- **Email:** `admin@test.com`
- **Password:** `123456`

## Running the Backend

```bash
cd backend
npm run dev      # starts the API on http://localhost:5000 with auto-reload
```

Production build: `npm run build && npm start`.

## Running the Frontend

```bash
cd frontend
npm run dev      # starts the app on http://localhost:3000
```

Production build: `npm run build && npm start`.

## API Documentation

All `/api/tasks/*` routes require an `Authorization: Bearer <token>` header
obtained from `/api/auth/login`.

| Method | Endpoint             | Description                                   |
| ------ | --------------------- | ---------------------------------------------- |
| POST   | `/api/auth/login`     | Log in with email + password, returns a JWT    |
| POST   | `/api/auth/logout`    | Stateless logout (client discards the token)   |
| GET    | `/api/tasks`          | List tasks (`?search=&status=&priority=&sort=`)|
| GET    | `/api/tasks/stats`    | Dashboard counts (total/pending/etc.)          |
| GET    | `/api/tasks/:id`      | Get a single task                              |
| POST   | `/api/tasks`          | Create a task                                  |
| PUT    | `/api/tasks/:id`      | Update a task                                  |
| DELETE | `/api/tasks/:id`      | Delete a task                                  |

**Query params for `GET /api/tasks`:**
- `search` — matches against task title (case-insensitive)
- `status` — `PENDING` | `IN_PROGRESS` | `COMPLETED`
- `priority` — `LOW` | `MEDIUM` | `HIGH`
- `sort` — `newest` | `oldest` | `dueDate`

**Task shape:**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "priority": "LOW | MEDIUM | HIGH",
  "status": "PENDING | IN_PROGRESS | COMPLETED",
  "dueDate": "ISO date string",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Assumptions Made

- No registration page: the single admin account is seeded directly into
  the database, as instructed by the spec.
- Tasks are scoped to the logged-in user's `userId`, even though only one
  user exists today — this keeps the data model correct if multi-user
  support were added later.
- "Overdue" is computed server-side as: due date is before today **and**
  status is not `COMPLETED`.
- Logout is handled client-side (discarding the JWT), since the token is
  stateless; there's no server-side session to invalidate.
- Search matches on task title only, per the spec, and combines with any
  active status/priority filters (all filters are applied together with
  logical AND).

## Known Limitations

- No refresh-token flow — the JWT simply expires after `JWT_EXPIRES_IN` and
  the user has to log in again (listed as a bonus feature, not required).
- No automated test suite included, given the assessment's time frame.
- No pagination on the task list; fine for the expected data volume of a
  single-user demo, but would be needed at scale.

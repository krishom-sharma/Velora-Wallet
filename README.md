# Velora Wallet

Velora Wallet is a premium Apple Wallet-inspired financial dashboard built with the MERN stack. It includes secure authentication, live transaction notifications, QR payments, wallet-style card management, profile/settings flows, analytics, and a polished responsive UI with dark/light mode, glassmorphism, and Framer Motion.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, TanStack Query, Zustand
- Backend: Node.js, Express, Mongoose, Socket.io, JWT, bcrypt
- Security: Helmet, CSRF protection, rate limiting, Mongo sanitization, encrypted card storage
- Testing: Vitest, Supertest, mongodb-memory-server

## Project structure

```text
frontend/   React application
backend/    Express API, models, controllers, services, tests
docs/       API reference
```

## Quick start

1. Install dependencies:
```bash
npm install
```

2. Create environment files:
- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

3. Start MongoDB locally, then run:
```bash
npm run dev
```

4. Open the app at [http://localhost:5173](http://localhost:5173)

## Seed sample data

```bash
npm run seed
```

Seeded demo users:
- `avery@velora.dev / Velora123!`
- `mila@velora.dev / Velora123!`
- `jordan@velora.dev / Velora123!`

## Available scripts

```bash
npm run dev
npm run build
npm run test
npm run seed
```

## Feature checklist

- JWT auth with bcrypt password hashing and secure cookie sessions
- Dashboard overview with balance, wallet cards, analytics, and recent activity
- Send money, request money, and pay pending requests
- QR generation and QR payment processing
- Searchable, filterable, grouped transaction history
- Card management with masked and encrypted card storage
- Profile editing with avatar upload
- Settings for theme, security, and notifications
- Real-time transaction notifications via Socket.io
- Backend validation, MVC structure, security middleware, and tests

## API docs

Detailed endpoint notes live in [docs/api.md](/Users/krishomsharma/Documents/Codex/2026-04-19-you-are-a-senior-full-stack/docs/api.md).

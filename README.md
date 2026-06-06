# The Bay Suites

A full-stack booking, property-management and guest-support platform for The Bay Suites.

## Stack

- Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- shadcn-style local UI primitives and TanStack Query
- NestJS REST API and Socket.IO chat
- PostgreSQL with automatic schema setup
- In-memory fallback, TTL caching, request coalescing and keyed booking queues

## Run locally

```bash
npm install
cp .env.example .env
docker compose up -d
npm run dev
```

The web app runs at `http://localhost:3000`; the API runs at
`http://localhost:4000/api`.

PostgreSQL is optional during UI development. Without `DATABASE_URL`, the API
uses in-memory persistence and logs a warning.

## Key API routes

- `GET /api/properties`
- `GET /api/properties/:slug`
- `POST /api/bookings/quote`
- `POST /api/bookings`
- `GET /api/bookings/availability/:propertyId`
- `POST /api/contacts`
- `POST /api/assessments`
- `POST /api/webhooks/:provider`
- `GET /api/dashboard`
- Socket.IO events: `join`, `message`

## Production integrations still required

Connect a real payment provider before accepting card data. Email delivery,
authentication, property channel synchronization and production object storage
should also be added before launch. The database schema and API boundaries are
kept portable for a later Supabase migration.

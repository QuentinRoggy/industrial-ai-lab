# Getting started

## Prerequisites

- Node.js 24 or newer
- pnpm 9 or newer
- Docker with Compose

## Setup

```bash
pnpm install
cp .env.example .env
node ace generate:key
docker compose up -d postgres
node ace migration:run
pnpm dev
```

The application listens on `http://localhost:3333`.

## Database lifecycle

```bash
node ace migration:run
node ace migration:rollback
node ace migration:fresh
```

Do not edit a migration after it has been merged. Add a new migration instead.

## Verification

Run the complete local gate before committing:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Environment

`.env.example` documents all required variables. Real `.env` files are never committed. Local PostgreSQL credentials in the example are development-only.

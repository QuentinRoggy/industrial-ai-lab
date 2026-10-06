# Architecture overview

## Style

Industrial AI Lab is a server-first modular monolith. AdonisJS owns routing, authentication, transactions, permissions, and rendering. Inertia transports typed page props to React without introducing a separate SPA API by default.

```text
Browser
  └─ Inertia + React
       └─ AdonisJS controllers
            └─ Application services / commands / queries
                 ├─ Bounded industrial modules
                 ├─ AI tool boundary
                 └─ Domain events + transactional outbox
                      └─ PostgreSQL
```

Background workers, object storage, Redis, pgvector, and an optional Python runtime are introduced only when a concrete experiment needs them.

## Runtime responsibilities

### AdonisJS application

- authentication and session management;
- server-side routes and Inertia responses;
- validation, permissions, and business transactions;
- deterministic ERP source of truth;
- experiment orchestration and result presentation.

### PostgreSQL

- transactional business data;
- immutable stock and audit records;
- experiment definitions and runs;
- domain events and outbox messages;
- vector columns later, if semantic search is justified.

### Optional worker

Long-running document, model, simulation, or evaluation jobs must leave the HTTP request path. Introduce a worker and Redis queue through an ADR when the first such job is implemented.

### Optional Python runtime

Python is allowed for libraries that materially benefit from it: optimisation, classical ML, time series, computer vision, and scientific evaluation. It must expose a versioned contract and must not become a second owner of ERP business rules.

## Request flow

1. Route authenticates the user.
2. Controller validates input.
3. Application service checks authorisation and executes the use case.
4. Domain rules protect invariants.
5. Transaction persists state and outbox events.
6. Controller returns an Inertia response or redirect.

## Dependency direction

Presentation may depend on application code. Application code may depend on domain abstractions. Infrastructure implements interfaces owned by the module. Domain code must not depend on HTTP, Inertia, model providers, or concrete database clients.

## Data ownership

Each bounded module owns its tables and write operations. Cross-module reads use explicit query services or projections. A module must not update another module's tables directly.

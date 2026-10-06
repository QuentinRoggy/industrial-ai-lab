# Industrial AI Lab

A synthetic industrial ERP and reproducible experimentation environment for testing what AI can—and cannot—bring to industrial operations.

The project is built with **AdonisJS 7**, **Inertia.js**, **React**, **PostgreSQL**, and TypeScript. It deliberately starts as a modular monolith.

## Purpose

The ERP is a test bench, not the end product. It will model enough of a factory to support repeatable experiments across production, methods, inventory, purchasing, quality, traceability, documents, planning, and management reporting.

Each AI proof of concept should include:

- a precise industrial problem;
- deterministic synthetic data and known ground truth;
- a non-AI baseline when relevant;
- measurable evaluation criteria;
- evidence linked to every conclusion;
- explicit limits and deployment conditions.

## Current state

This repository contains the AdonisJS 7 + Inertia React foundation, authentication starter, PostgreSQL configuration, bounded-module skeleton, architecture decisions, and the documentation required for human and AI contributors. Business modules are intentionally not implemented yet.

## Quick start

Requirements: Node.js 24+, pnpm 9+, and Docker.

```bash
pnpm install
cp .env.example .env
node ace generate:key
docker compose up -d postgres
node ace migration:run
pnpm dev
```

Open `http://localhost:3333`.

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Documentation

- [`AGENTS.md`](AGENTS.md): mandatory instructions for coding agents
- [`docs/product/scope.md`](docs/product/scope.md): goals and exclusions
- [`docs/architecture/overview.md`](docs/architecture/overview.md): system architecture
- [`docs/architecture/modules.md`](docs/architecture/modules.md): module boundaries
- [`CONTEXT-MAP.md`](CONTEXT-MAP.md): bounded contexts, their glossaries, and how they relate
- [`docs/architecture/ai-and-experiments.md`](docs/architecture/ai-and-experiments.md): AI safety and evaluation model
- [`docs/development/getting-started.md`](docs/development/getting-started.md): local setup
- [`docs/development/conventions.md`](docs/development/conventions.md): implementation rules
- [`docs/roadmap.md`](docs/roadmap.md): delivery sequence

## License

MIT. Synthetic examples are provided for demonstration and research; they must not be represented as evidence from a real industrial deployment.

# AI development guide

This file is the entry point for coding agents. Read it before changing the project.

## Read order

1. `docs/product/scope.md`
2. `docs/architecture/overview.md`
3. `docs/architecture/modules.md`
4. `CONTEXT-MAP.md` and the `CONTEXT.md` of each module involved
5. `docs/architecture/ai-and-experiments.md`
6. `docs/development/conventions.md`
7. Relevant ADRs in `docs/decisions/`

## Project intent

Industrial AI Lab is a realistic, synthetic industrial ERP used to build and evaluate AI proofs of concept. It is not a general-purpose ERP. The ERP core provides deterministic business behaviour; AI experiments observe data, produce evidence-backed recommendations, and are evaluated against known ground truth.

## Non-negotiable rules

- Keep the application a modular monolith until an ADR explicitly changes that decision.
- Put new business code inside one bounded module under `app/modules/`.
- Keep controllers and Inertia pages thin. Business rules belong in application/domain code.
- Never let an LLM query the database directly or execute arbitrary SQL.
- AI integrations must call explicit application tools and respect the current user's permissions.
- AI output is not a source of truth. Start with read-only analysis, recommendations, or drafts.
- Every AI conclusion must retain its evidence, model configuration, prompt version, latency, and cost when available.
- Synthetic scenarios must be deterministic from a seed and must define their ground truth.
- Stock changes are represented by immutable movements. Never silently overwrite history.
- Versioned industrial definitions such as BOMs and routings are not edited retroactively.
- Treat imported documents as untrusted input, including text sent to a model.
- Never commit secrets, real client data, proprietary rules, or copied production datasets.
- Add or update an ADR when changing a structural decision.

## Commands

```bash
pnpm install
cp .env.example .env
node ace generate:key
docker compose up -d postgres
node ace migration:run
pnpm dev

pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Definition of done

A change is complete only when:

- behaviour is covered by an appropriate unit or functional test;
- permissions and failure modes are considered;
- migrations and seed data remain reproducible;
- relevant documentation is updated;
- typecheck, lint, tests, and production build pass.

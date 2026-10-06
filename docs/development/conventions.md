# Development conventions

## Language and naming

Code, identifiers, commits, and technical documentation are written in English. User-facing copy may be localised later. Use industrial vocabulary consistently with `docs/domain/model.md`.

## Application structure

- Routes select a controller or render a simple page.
- Controllers handle HTTP concerns only.
- Validators own input shape validation.
- Application services implement use cases and transaction boundaries.
- Domain objects protect business invariants.
- Repositories and provider adapters belong to infrastructure.
- React pages render server-provided props and submit intents; they do not reproduce domain rules.

## Commands and queries

Name use cases explicitly, for example `ReleaseManufacturingOrder`, `ReceivePurchaseOrder`, or `FindAtRiskOrders`. A command changes state. A query does not. Do not hide writes inside a query or model accessor.

## Persistence

- Use PostgreSQL migrations through Lucid.
- Prefer UUID identifiers for new domain aggregates.
- Store timestamps in UTC.
- Use decimal database types for quantities and money; never binary floating point.
- Preserve immutable ledgers and versioned master data.
- Use transactions for multi-table business operations.

## Tests

- Unit tests cover domain invariants and deterministic algorithms.
- Functional tests cover routes, permissions, transactions, and Inertia responses.
- Scenario tests prove deterministic generation from a seed.
- Experiment tests validate schemas, tool permissions, evidence retention, and metrics.

## Commits

Use Conventional Commits in English, keep changes focused, and update documentation in the same change as the architectural behaviour it describes.

## Architectural change

Create a numbered ADR in `docs/decisions/` for changes to module ownership, runtime boundaries, persistence strategy, authentication, AI autonomy, or deployment topology.

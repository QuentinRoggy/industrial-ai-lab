# ADR 0006: Check static role permissions in application services

- Status: Accepted

## Context

The definition of done requires every use case to consider permissions, and ADR 0003 requires AI tools to respect the current user's permissions. The Lab represents demo personas (planner, buyer, quality engineer, operator, and others), not real organisations with custom access policies. Per-site access is not needed while the slice uses one site.

## Decision

- `iam` owns a static matrix from roles to permissions, in code. A permission names one command or query, for example `organization.create_site`.
- A user holds one or more roles; roles apply to the whole organization.
- Every application service receives the acting `Actor` and asks `iam` whether the actor holds the permission before doing any work. Controllers, seeders, and AI tools reach use cases only through these services, so the check cannot be skipped.
- Granting roles outside a use case is reserved for seeding the first administrator and for tests.

## Alternatives considered

- **AdonisJS Bouncer policies in controllers.** Keeps checks at the HTTP edge, but seeders, simulation, and AI tools call application services directly and would bypass them.
- **Roles and permissions stored in the database.** Configurable, but the Lab has no need for runtime-editable policies and the matrix would no longer be reviewable in code.

## Consequences

- Permissions are reviewed and changed through code review.
- Per-site roles require a new decision when a second site is used.

# ADR 0001: Start with a modular monolith

- Status: Accepted

## Context

The Lab needs coherent transactions and rapid iteration across tightly related industrial workflows. Independent services would add deployment, messaging, consistency, and observability overhead before boundaries are proven.

## Decision

Use one AdonisJS application and one PostgreSQL database. Enforce bounded contexts in code and table ownership. Use application services for synchronous interaction and a transactional outbox for durable reactions.

## Consequences

Development and deployment remain simple. Module discipline is mandatory. A module may later be extracted only when measured runtime or team constraints justify it and a new ADR defines data ownership and migration.

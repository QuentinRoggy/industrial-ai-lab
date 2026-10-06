# ADR 0003: AI is not the system of record

- Status: Accepted

## Context

Model output is probabilistic, can be manipulated by untrusted input, and cannot safely own industrial transactions.

## Decision

AI accesses ERP capabilities only through explicit authorised tools. Initial experiments are read-only, recommendations, or drafts. Every result retains evidence and run metadata. Deterministic application services remain authoritative.

## Consequences

Experiments require more instrumentation, but remain auditable and comparable. Autonomous writes require a separate ADR and explicit safety controls.

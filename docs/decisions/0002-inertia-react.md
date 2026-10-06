# ADR 0002: Use Inertia with React

- Status: Accepted

## Context

The Lab needs interactive visualisations but does not initially need independently deployed frontend and API applications.

## Decision

Use the official AdonisJS 7 Inertia React stack. AdonisJS owns routing and data loading; React renders pages and local interactions. Add JSON endpoints only for concrete integrations or asynchronous UI needs.

## Consequences

Authentication, validation, routing, and deployment stay unified. React components must not duplicate server-side authorisation or domain rules.

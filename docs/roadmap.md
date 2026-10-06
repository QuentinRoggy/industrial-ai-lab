# Roadmap

## Phase 0 — Foundation

- AdonisJS 7, Inertia, React, authentication
- PostgreSQL development environment
- modular boundaries and contributor documentation
- continuous integration quality gate

## Phase 1 — Industrial vertical slice

Implement one complete deterministic flow:

1. organisation and site;
2. items, BOM, routing, supplier, and customer demand;
3. purchase receipt and stock movements;
4. manufacturing order release, consumption, production, and scrap;
5. quality inspection and non-conformity;
6. traceability timeline.

## Phase 2 — Simulation

- seeded synthetic factory generator;
- virtual clock;
- scenario definition format;
- supplier delay, stock anomaly, quality drift, traceability gap, and obsolete BOM scenarios;
- machine-readable ground truth.

## Phase 3 — Lab platform

- experiment registry;
- dataset snapshots;
- provider gateway and authorised tools;
- run traces, evidence, cost, and latency;
- baseline comparison and evaluation UI.

## Phase 4 — POC portfolio

Candidate experiments include late-order risk, document extraction and reconciliation, non-conformity similarity, suspicious stock movements, traceability explanation, process drift, constrained rescheduling, and visual inspection.

The order of POCs is deliberately not fixed. Choose experiments that improve coverage across industrial functions and AI techniques while reusing the common evaluation platform.

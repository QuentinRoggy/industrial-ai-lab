# Roadmap

## Phase 0 — Foundation

- AdonisJS 7, Inertia, React, authentication
- PostgreSQL development environment
- modular boundaries and contributor documentation
- continuous integration quality gate

## Phase 1 — Industrial vertical slice

Implement one complete deterministic flow around a reference product, a two-level valve assembly, delivered as slices merged one at a time:

1. foundation: shared primitives, organisation and site, static roles and permissions;
2. master data: items, work centres, versioned BOMs and routings, suppliers, and customers;
3. inventory: locations, lots, immutable stock movements, balances, and stock status;
4. purchasing: purchase orders and partial receipts;
5. manufacturing: order release, operation execution, material issue, output, and production scrap;
6. quality: receipt and final inspections, non-conformities, dispositions, and corrective actions;
7. sales: customer demand and shipments;
8. planning: deterministic MRP runs and human firming of planned orders;
9. traceability: upstream and downstream lot timeline, deterministic seed, and an end-to-end test of the whole flow.

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

Candidate experiments include late-order risk, planning compared with the deterministic MRP baseline, document extraction and reconciliation, non-conformity similarity, suspicious stock movements, traceability explanation, process drift, constrained rescheduling, and visual inspection.

The order of POCs is deliberately not fixed. Choose experiments that improve coverage across industrial functions and AI techniques while reusing the common evaluation platform.

# ADR 0005: Add a planning module for deterministic MRP

- Status: Accepted

## Context

Phase 1 needs material requirements planning: from customer demand, available stock, open supply, and effective bills of materials, compute what must be bought or made and when. No existing module owns this. Planning reads data owned by sales, inventory, purchasing, manufacturing, catalog, and methods, and its output feeds purchasing and manufacturing.

MRP was previously listed as a candidate AI experiment. A deterministic MRP is more useful to the Lab as a baseline that AI planners are compared against.

## Decision

- Add a `planning` bounded module. It owns MRP runs, gross and net requirements, and planned orders.
- An MRP run reads other modules only through their query services. It never creates purchase orders or manufacturing orders.
- A planned order becomes a real order only when a person firms it, through the purchasing or manufacturing application service.
- Each MRP run is persisted with its inputs date, horizon, author, and planned orders. A new run supersedes the unfirmed planned orders of the previous run; firmed orders keep a link to the run that proposed them.
- The phase 1 calculation is deliberately minimal: open sales order lines as gross requirements, available stock only, open purchase and manufacturing orders as scheduled supply, multi-level explosion of the bill of materials version effective at the requirement date, lot-for-lot sizing, and a fixed item lead time in calendar days. Safety stock, working calendars, lot sizing rules, and capacity are out of scope until a scenario needs them.

## Alternatives considered

- **MRP inside `manufacturing`.** Manufacturing would then own purchase proposals and read most other modules, blurring its boundary.
- **No MRP in phase 1.** Simpler, but the Lab would lack the deterministic planning baseline that late-order and rescheduling experiments need.

## Consequences

- One more module to maintain, with read dependencies on six others.
- Planning results are reproducible and can serve as ground truth or baseline in experiments.
- Firming stays a human decision, consistent with ADR 0003.

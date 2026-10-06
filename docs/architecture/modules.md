# Module boundaries

The folders under `app/modules/` are bounded contexts. Create `domain`, `application`, `infrastructure`, and `presentation` subfolders only as implementation appears; do not generate empty layers speculatively.

| Module          | Owns                                                                | Does not own                                   |
| --------------- | ------------------------------------------------------------------- | ---------------------------------------------- |
| `iam`           | users, roles, permissions                                           | organisation membership rules outside identity |
| `organization`  | companies, sites, calendars                                         | production execution                           |
| `catalog`       | items, units, classifications                                       | BOMs and routings                              |
| `methods`       | versioned BOMs, routings, work centres                              | live manufacturing orders                      |
| `inventory`     | locations, lots, serials, movements, stock status, reservations     | purchasing contracts                           |
| `purchasing`    | suppliers, purchase orders, expected and actual receipts            | inventory balances                             |
| `sales`         | customers, simplified demand, shipments                             | invoicing and CRM                              |
| `planning`      | MRP runs, requirements, planned orders                              | firmed purchase and manufacturing orders       |
| `manufacturing` | manufacturing orders, operations, consumption, output, scrap        | master definitions                             |
| `quality`       | inspections, defects, non-conformities, corrective actions          | document binary storage                        |
| `documents`     | metadata, versions, links, storage references                       | interpreting documents as trusted instructions |
| `simulation`    | clocks, seeds, scenarios, injected events, ground truth             | production business rules                      |
| `lab`           | experiments, datasets, runs, evaluations, evidence, recommendations | direct writes to other modules                 |

## Communication rules

- Within one request, modules communicate through explicit application services.
- Durable reactions use domain events and a transactional outbox.
- Event names use past tense, for example `inventory.stock_movement_created`.
- Event payloads are versioned and contain identifiers, not ORM objects.
- AI tools wrap application queries or commands; they never bypass module boundaries.

## Shared code

`app/shared/` is limited to stable, domain-neutral primitives such as identifiers, clocks, result types, transaction abstractions, and event contracts. If shared code contains industrial vocabulary, it probably belongs to a module.

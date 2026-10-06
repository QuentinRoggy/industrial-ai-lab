# Context Map

Industrial AI Lab is a synthetic industrial ERP split into bounded contexts. Each context owns its language; a term defined in one context is referenced, not redefined, by the others.

## Contexts

- [IAM](./app/modules/iam/CONTEXT.md): users, roles, and permissions
- [Organization](./app/modules/organization/CONTEXT.md): the company and its sites
- [Catalog](./app/modules/catalog/CONTEXT.md): items and their planning and control attributes
- [Methods](./app/modules/methods/CONTEXT.md): versioned bills of materials, routings, and work centres
- [Inventory](./app/modules/inventory/CONTEXT.md): locations, lots, and the immutable stock ledger
- [Purchasing](./app/modules/purchasing/CONTEXT.md): suppliers, purchase orders, and receipts
- [Sales](./app/modules/sales/CONTEXT.md): customers, demand, and shipments
- [Planning](./app/modules/planning/CONTEXT.md): material requirements planning and planned orders
- [Manufacturing](./app/modules/manufacturing/CONTEXT.md): manufacturing orders and their execution
- [Quality](./app/modules/quality/CONTEXT.md): inspections, non-conformities, and corrective actions
- [Documents](./app/modules/documents/CONTEXT.md): versioned documents linked to business records
- [Simulation](./app/modules/simulation/CONTEXT.md): seeded scenarios and ground truth
- [Lab](./app/modules/lab/CONTEXT.md): AI experiments, runs, findings, and evaluations

## Scope

There is one **Organization**. Items, bills of materials, routings, suppliers, and customers belong to the organization. Locations, stock, purchase orders, sales orders, manufacturing orders, and inspections belong to a **Site**.

## Relationships

- **Catalog → everyone**: every context references items by identifier; only Catalog defines what an item is.
- **Methods → Manufacturing**: releasing a manufacturing order freezes the approved bill of materials and routing versions effective at release.
- **Methods → Planning**: an MRP run explodes the bill of materials version effective at each requirement date.
- **Sales, Purchasing, Manufacturing, Inventory → Planning**: an MRP run reads open demand, available stock, and open supply; it never creates orders itself.
- **Planning → Purchasing, Manufacturing**: a person firms a planned order into a purchase order or a manufacturing order.
- **Purchasing → Inventory**: a receipt records arrival and asks Inventory for receipt movements.
- **Manufacturing → Inventory**: material issues and production output create stock movements.
- **Sales → Inventory**: a shipment asks Inventory for an outbound movement.
- **Quality ↔ Inventory**: stock that requires inspection enters in quarantine; the inspection result releases or blocks it through status changes.
- **Quality → Purchasing, Manufacturing**: receipt inspections refer to receipts; final inspections refer to manufacturing orders.
- **Simulation → core contexts**: scenarios drive the same commands people use and record the expected answers.
- **Lab → core contexts**: experiments read through authorised tools and never write to other contexts directly.

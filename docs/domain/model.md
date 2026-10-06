# Core domain model

This document is a map, not a database schema. Names and relationships should remain stable unless an ADR records a better model.

## Organisation

`Organization` contains one or more `Site`s. A site has calendars, storage locations, work centres, and users with roles.

## Product definition

An `Item` may be purchased, manufactured, sold, or consumed. A manufactured item references an approved version of a `BillOfMaterials` and a `Routing`. Definitions have lifecycle states and effective dates; historical manufacturing orders keep the exact versions used at release time.

## Inventory

A `StockMovement` is the immutable ledger entry. Inventory balance is derived from movements. Optional `Lot` and `SerialNumber` entities provide genealogy. A `Reservation` allocates available quantity to demand without changing physical stock.

Core invariant: a stock correction creates another movement; it never edits a historical movement.

## Demand and supply

A `SalesOrderLine` represents dated demand. A `PurchaseOrderLine` represents expected supply. A `Receipt` confirms actual arrival and creates inventory movements through the inventory module.

## Manufacturing

A `ManufacturingOrder` freezes product, quantity, BOM version, and routing version. It contains sequenced `OperationExecution`s. Material issue, finished output, by-product, and scrap declarations create inventory movements.

## Quality

An `Inspection` records expected characteristics and observed results. A failed result may create a `NonConformity`. Corrective actions remain human-owned even when AI proposes classification, similar cases, or draft actions.

## Documents and traceability

A `Document` has immutable versions and links to domain objects. Traceability traverses explicit links among receipts, lots, stock movements, manufacturing orders, inspections, documents, and shipments.

## Simulation

A `ScenarioDefinition` describes initial state, scheduled events, anomalies, and ground truth. A `ScenarioRun` records the seed, virtual clock, generated events, and expected answers. The same version and seed must reproduce the same state.

## Lab

An `ExperimentDefinition` versions the hypothesis, input/output contracts, baseline, metrics, and allowed tools. An `ExperimentRun` binds that definition to a dataset snapshot and model configuration. A `Finding` links a result to evidence. An `Evaluation` compares findings with ground truth.

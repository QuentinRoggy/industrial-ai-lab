# Catalog

Defines the items the organization buys, makes, stores, and sells.

## Language

**Item**:
Anything the organization buys, makes, stores, or sells, identified by a code. An item can be purchased, manufactured, or both.
_Avoid_: Article, product, part, SKU

**Stock Unit**:
The single unit in which an item is counted, bought, and consumed, chosen from a fixed list (unit, kg, g, m, mm, l). There is no unit conversion.
_Avoid_: UoM, purchase unit

**Lot Tracking**:
An item attribute requiring every stock movement of that item to name a lot.

**Lead Time**:
The number of calendar days needed to obtain an item, by purchase or by manufacture.

**Inspection Requirement**:
Item attributes stating whether a receipt inspection, a final inspection, both, or neither are required before stock becomes available. Only a purchased item can require a receipt inspection, and only a manufactured item a final inspection.

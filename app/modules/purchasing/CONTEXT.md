# Purchasing

Manages what the organization orders from suppliers and what actually arrives.

## Language

**Supplier**:
An external company the organization buys items from.
_Avoid_: Vendor

**Purchase Order**:
A commitment to buy items from one supplier for one site.

**Purchase Order Line**:
One item, quantity, unit price, currency, and promised date within a purchase order. It is expected supply.

**Receipt**:
The recorded arrival of goods against a purchase order line. A line can have several receipts, but never more in total than ordered.
_Avoid_: Delivery, goods receipt note

**Open Quantity**:
The ordered quantity of a purchase order line not yet received. A line closes when nothing is open or when a person closes it early.
_Avoid_: Backorder, remainder

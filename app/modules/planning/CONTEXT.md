# Planning

Computes what must be bought or made, and when, to meet demand.

## Language

**MRP Run**:
One deterministic calculation of material requirements from demand, available stock, open supply, and effective bills of materials.
_Avoid_: Planning run, calculation

**Gross Requirement**:
A quantity of an item needed by a date, from demand or from the explosion of a parent's bill of materials.

**Net Requirement**:
The part of a gross requirement not covered by available stock or open supply.

**Planned Order**:
A proposal from an MRP run to buy or make a quantity of an item by a date. It is never an order until a person firms it. A newer MRP run supersedes the unfirmed planned orders of the previous one.
_Avoid_: Suggestion, requisition

**Firming**:
A person turning a planned order into a purchase order or a manufacturing order. For a purchase, the buyer chooses the supplier and price at firming.

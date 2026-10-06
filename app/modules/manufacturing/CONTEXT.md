# Manufacturing

Executes the production of manufactured items.

## Language

**Manufacturing Order**:
An order to make a quantity of one item at one site. From release it is bound to exactly one bill of materials version and one routing version.
_Avoid_: Work order, production order, job

**Release**:
The moment a manufacturing order freezes its definition versions and becomes executable.

**Operation Execution**:
The record of one routing operation performed for a manufacturing order, with its good quantity and production scrap. Operations may overlap, but an operation's cumulative good quantity never exceeds that of the previous operation.

**Material Issue**:
The declared consumption of a component, with its lot when tracked. It may differ from the bill of materials; the difference is kept, not prevented.
_Avoid_: Backflush, consumption

**Production Output**:
The declared quantity of the manufactured item put into stock. It never exceeds the good quantity of the last operation. All output of one manufacturing order forms a single lot when tracked.

**Production Scrap**:
Units lost during an operation. They never entered stock, so they create no stock movement.
_Avoid_: Stock write-off

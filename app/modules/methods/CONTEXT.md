# Methods

Defines how manufactured items are built.

## Language

**Bill of Materials**:
A versioned list of component items and quantities needed to make one unit of a manufactured item.
_Avoid_: Recipe, formula, nomenclature

**Routing**:
A versioned, ordered sequence of operations needed to make a manufactured item.
_Avoid_: Process plan, gamme

**Operation**:
One step of a routing, performed at a work centre, with a setup time and a run time per unit.

**Work Centre**:
A group of people or machines where operations are performed and capacity is counted.
_Avoid_: Workstation, machine, resource

**Definition Version**:
One version of a bill of materials or routing. It is draft, approved, or obsolete; an approved version never changes.

**Effective Date**:
The date from which an approved version applies. At any date, at most one approved version of a definition is effective for an item.

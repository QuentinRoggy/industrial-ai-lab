# Inventory

Records where stock is, in which state, and how it got there.

## Language

**Location**:
A named place within a site where stock is held. Locations are flat; there are no bins or hierarchy.
_Avoid_: Warehouse, bin, store

**Lot**:
A quantity of one item sharing the same origin, identified by an internal lot number so that it can be traced. A received lot also keeps the supplier's lot number.
_Avoid_: Batch

**Supplier Lot Number**:
The lot identifier given by the supplier, kept on the internal lot it arrived as. It is never used as the internal identity.

**Stock Movement**:
An immutable ledger entry recording a quantity of an item entering, leaving, moving within a site, or changing stock status. It always refers to the business record that caused it. Its kind is one of receipt, material issue, production output, shipment, transfer, status change, write-off, or count adjustment.
_Avoid_: Transaction, stock adjustment record

**Stock Balance**:
The quantity of an item per location, lot, and stock status, derived from stock movements and never edited.
_Avoid_: On-hand record

**Stock Status**:
The usability of stock: available, quarantine (waiting for inspection), or blocked (failed inspection). Status is independent of location. Only available stock can be issued or shipped, and no balance may become negative.

**Transfer**:
A stock movement between two locations of the same site.

**Status Change**:
A stock movement that changes stock status without moving stock.

**Stock Write-off**:
A stock movement destroying existing stock, with a reason.
_Avoid_: Scrap (reserved for production scrap)

**Count Adjustment**:
A stock movement correcting a balance to a physically counted quantity, with a reason.
_Avoid_: Correction, edit

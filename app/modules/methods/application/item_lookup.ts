/**
 * What methods needs to know about a catalog item.
 */
export interface ItemLookup {
  findById(id: string): Promise<{ manufactured: boolean } | null>
}

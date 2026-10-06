import type { Item } from '#modules/catalog/domain/item'
import type { ItemCode } from '#modules/catalog/domain/item_code'
import type { Transaction } from '#shared/application/unit_of_work'

export interface ItemRepository {
  existsWithCode(transaction: Transaction, code: ItemCode): Promise<boolean>
  add(transaction: Transaction, item: Item, createdAt: Date): Promise<void>
}

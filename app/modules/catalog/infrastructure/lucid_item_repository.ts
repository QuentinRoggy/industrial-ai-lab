import type { Item } from '#modules/catalog/domain/item'
import { duplicateItemCode, type ItemCode } from '#modules/catalog/domain/item_code'
import type { ItemRepository } from '#modules/catalog/domain/item_repository'
import { ItemRecord } from '#modules/catalog/infrastructure/item_record'
import type { Transaction } from '#shared/application/unit_of_work'
import { lucidClient } from '#shared/infrastructure/lucid_unit_of_work'
import { isUniqueViolation } from '#shared/infrastructure/unique_violation'
import { DateTime } from 'luxon'

export class LucidItemRepository implements ItemRepository {
  async existsWithCode(transaction: Transaction, code: ItemCode): Promise<boolean> {
    const record = await ItemRecord.query({ client: lucidClient(transaction) })
      .where('code', code.toString())
      .first()

    return record !== null
  }

  async add(transaction: Transaction, item: Item, createdAt: Date): Promise<void> {
    try {
      await ItemRecord.create(
        {
          id: item.id,
          code: item.code.toString(),
          description: item.description,
          purchased: item.purchased,
          manufactured: item.manufactured,
          stockUnit: item.stockUnit,
          lotTracked: item.lotTracked,
          leadTimeDays: item.leadTimeDays,
          receiptInspection: item.receiptInspection,
          finalInspection: item.finalInspection,
          createdAt: DateTime.fromJSDate(createdAt),
        },
        { client: lucidClient(transaction) }
      )
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw duplicateItemCode(item.code)
      }
      throw error
    }
  }
}

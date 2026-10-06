import type { ItemView } from '#modules/catalog/application/views'
import { Item, type ItemDefinition } from '#modules/catalog/domain/item'
import { duplicateItemCode } from '#modules/catalog/domain/item_code'
import type { ItemRepository } from '#modules/catalog/domain/item_repository'
import type { AccessControl, Actor } from '#modules/iam/application/access_control'
import type { Outbox } from '#shared/application/outbox'
import type { UnitOfWork } from '#shared/application/unit_of_work'
import type { Clock } from '#shared/domain/clock'

export class CreateItem {
  constructor(
    private readonly accessControl: AccessControl,
    private readonly unitOfWork: UnitOfWork,
    private readonly items: ItemRepository,
    private readonly outbox: Outbox,
    private readonly clock: Clock
  ) {}

  async execute(actor: Actor, input: ItemDefinition): Promise<ItemView> {
    await this.accessControl.ensure(actor, 'catalog.create_item')

    return this.unitOfWork.run(async (transaction) => {
      const item = Item.create(input)
      if (await this.items.existsWithCode(transaction, item.code)) {
        throw duplicateItemCode(item.code)
      }

      const now = this.clock.now()
      await this.items.add(transaction, item, now)
      await this.outbox.record(transaction, {
        name: 'catalog.item_created',
        version: 1,
        occurredAt: now,
        payload: { itemId: item.id, code: item.code.toString() },
      })

      return toView(item)
    })
  }
}

function toView(item: Item): ItemView {
  return {
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
  }
}

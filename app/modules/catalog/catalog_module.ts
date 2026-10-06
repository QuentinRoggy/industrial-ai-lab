import { CreateItem } from '#modules/catalog/application/create_item'
import { ItemQueries } from '#modules/catalog/infrastructure/item_queries'
import { LucidItemRepository } from '#modules/catalog/infrastructure/lucid_item_repository'
import type { AccessControl } from '#modules/iam/application/access_control'
import { iamModule } from '#modules/iam/iam_module'
import type { Clock } from '#shared/domain/clock'
import { LucidOutbox } from '#shared/infrastructure/lucid_outbox'
import { LucidUnitOfWork } from '#shared/infrastructure/lucid_unit_of_work'
import { SystemClock } from '#shared/infrastructure/system_clock'

export function catalogModule({
  clock = new SystemClock(),
  accessControl = iamModule().accessControl,
}: { clock?: Clock; accessControl?: AccessControl } = {}) {
  return {
    createItem: new CreateItem(
      accessControl,
      new LucidUnitOfWork(),
      new LucidItemRepository(),
      new LucidOutbox(),
      clock
    ),
    items: new ItemQueries(),
  }
}

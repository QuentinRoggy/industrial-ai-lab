import type { RoutingView } from '#modules/methods/application/views'
import { effectiveVersionAt } from '#modules/methods/domain/effective_version'
import { CalendarDate } from '#shared/domain/calendar_date'
import { Decimal } from '#shared/domain/decimal'
import db from '@adonisjs/lucid/services/db'

export class RoutingQueries {
  /**
   * The routing in effect for an item at a date, if any.
   */
  async effectiveFor(itemId: string, date: string): Promise<RoutingView | null> {
    const rows = await db.from('routing_versions').where('item_id', itemId)
    const effective = effectiveVersionAt(
      rows.map((row) => ({
        row,
        status: row.status,
        effectiveFrom: row.effective_from ? CalendarDate.of(row.effective_from) : null,
        obsoleteFrom: row.obsolete_from ? CalendarDate.of(row.obsolete_from) : null,
      })),
      CalendarDate.of(date)
    )
    if (!effective) return null

    const operations = await db
      .from('routing_operations')
      .where('routing_version_id', effective.row.id)
      .orderBy('sequence')

    return {
      id: effective.row.id,
      itemId: effective.row.item_id,
      number: effective.row.number,
      status: effective.row.status,
      effectiveFrom: effective.row.effective_from,
      operations: operations.map((operation) => ({
        sequence: operation.sequence,
        workCentreId: operation.work_centre_id,
        setupMinutes: Decimal.of(operation.setup_minutes).toString(),
        runMinutesPerUnit: Decimal.of(operation.run_minutes_per_unit).toString(),
      })),
    }
  }
}

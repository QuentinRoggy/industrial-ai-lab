import type { ItemView } from '#modules/catalog/application/views'
import db from '@adonisjs/lucid/services/db'

export class ItemQueries {
  async list(): Promise<ItemView[]> {
    const rows = await db.from('items').orderBy('code')
    return rows.map(toView)
  }

  async findById(id: string): Promise<ItemView | null> {
    const row = await db.from('items').where('id', id).first()
    return row ? toView(row) : null
  }
}

function toView(row: Record<string, any>): ItemView {
  return {
    id: row.id,
    code: row.code,
    description: row.description,
    purchased: row.purchased,
    manufactured: row.manufactured,
    stockUnit: row.stock_unit,
    lotTracked: row.lot_tracked,
    leadTimeDays: row.lead_time_days,
    receiptInspection: row.receipt_inspection,
    finalInspection: row.final_inspection,
  }
}

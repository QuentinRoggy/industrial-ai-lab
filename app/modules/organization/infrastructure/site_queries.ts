import type { SiteView } from '#modules/organization/application/views'
import db from '@adonisjs/lucid/services/db'

export class SiteQueries {
  async list(): Promise<SiteView[]> {
    const rows = await db.from('sites').orderBy('code').select('id', 'code', 'name')
    return rows.map((row) => ({ id: row.id, code: row.code, name: row.name }))
  }
}

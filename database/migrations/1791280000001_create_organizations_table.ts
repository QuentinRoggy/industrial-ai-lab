import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
    })

    // The Lab models a single organization.
    this.schema.raw('create unique index organizations_single_row on organizations ((true))')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

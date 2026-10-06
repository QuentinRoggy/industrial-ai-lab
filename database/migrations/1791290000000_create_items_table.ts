import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('code', 40).notNullable().unique()
      table.string('description').notNullable()
      table.boolean('purchased').notNullable()
      table.boolean('manufactured').notNullable()
      table.string('stock_unit', 10).notNullable()
      table.boolean('lot_tracked').notNullable()
      table.integer('lead_time_days').notNullable()
      table.boolean('receipt_inspection').notNullable()
      table.boolean('final_inspection').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()

      table.check('purchased or manufactured')
      table.check('lead_time_days >= 0')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

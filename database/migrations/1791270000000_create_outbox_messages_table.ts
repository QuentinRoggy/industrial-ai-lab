import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'outbox_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.bigIncrements('position', { primaryKey: false }).notNullable()
      table.string('name').notNullable()
      table.integer('version').notNullable()
      table.jsonb('payload').notNullable()
      table.timestamp('occurred_at', { useTz: true }).notNullable()
      table.timestamp('recorded_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('published_at', { useTz: true }).nullable()

      table.index(['position'], undefined, { predicate: this.knex().whereNull('published_at') })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

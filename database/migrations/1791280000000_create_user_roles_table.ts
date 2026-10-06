import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('role', 50).notNullable()
      table.primary(['user_id', 'role'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

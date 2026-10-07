import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('routing_versions', (table) => {
      table.uuid('id').primary()
      table.uuid('item_id').notNullable().references('id').inTable('items')
      table.integer('number').notNullable()
      table.string('status', 10).notNullable()
      table.date('effective_from').nullable()
      table.date('obsolete_from').nullable()
      table.integer('version').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()

      table.unique(['item_id', 'number'])
      table.check("status in ('draft', 'approved', 'obsolete')")
    })

    this.schema.createTable('routing_operations', (table) => {
      table
        .uuid('routing_version_id')
        .notNullable()
        .references('id')
        .inTable('routing_versions')
        .onDelete('CASCADE')
      table.integer('sequence').notNullable()
      table.uuid('work_centre_id').notNullable().references('id').inTable('work_centres')
      table.decimal('setup_minutes', 18, 6).notNullable()
      table.decimal('run_minutes_per_unit', 18, 6).notNullable()

      table.primary(['routing_version_id', 'sequence'])
    })
  }

  async down() {
    this.schema.dropTable('routing_operations')
    this.schema.dropTable('routing_versions')
  }
}

import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('name').unique().notNullable()
    table.text('password').notNullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('lastLogin')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

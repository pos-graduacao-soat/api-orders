/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('order_products', function(table) {
    table.string('name').notNullable()
    table.decimal('price').notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('order_products', function(table) {
    table.dropColumn('name')
    table.dropColumn('price')
  })
}
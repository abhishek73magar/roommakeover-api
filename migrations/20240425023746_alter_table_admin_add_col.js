
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('admin', (table) => {
    table.boolean('order_email').defaultTo(true).comment("Send email or not while get new orders")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('admin', (table) => [
    table.dropColumn('order_email')
  ])
};

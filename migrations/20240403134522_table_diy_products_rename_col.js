/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('diy_products', (table) => {
    table.renameColumn('instructions', 'more_details')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('diy_products', (table) => {
    table.renameColumn('more_details', 'instructions')
  })
};

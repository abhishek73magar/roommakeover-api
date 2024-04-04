/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('blogs', (table) => {
    table.string('status', 1).defaultTo(2).comment('0 = unpublished \n 1 = published \n 2 = draft  ')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('blogs', (table) => {
    table.dropColumn('status')
  })
};

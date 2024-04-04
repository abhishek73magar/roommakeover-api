/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('hobbie_products', (table) => {
    table.dropColumn('category_id')
    table.dropColumn('status')
    table.string('status', 1).defaultTo(0).comment('published = 1 \n unpublished = 0 \n draft = 2 ')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('hobbie_products', (table) => {
    table.bigint('category_id')
    table.dropColumn('status')
    table.string('status', 255).defaultTo(null).comment('published, unpublished, draft')
  })
};

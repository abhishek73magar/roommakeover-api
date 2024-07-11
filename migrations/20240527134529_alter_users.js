/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.renameColumn('social_id', 'google_id')
    table.string('facebook_id', 255).comment('facebook social id')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumns(['facebook_id'])
    table.renameColumn('google_id', 'social_id')
  })
};

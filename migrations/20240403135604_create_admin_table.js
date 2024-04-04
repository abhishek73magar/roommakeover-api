/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('admin', (table) => {
    table.bigIncrements('id').notNullable()
    table.string('fullname', 255)
    table.string('email', 255).unique().notNullable()
    table.string('password', 255)
    table.string('status', 1).defaultTo(0).comment('0 = disabled \n 1 = enabled')
    table.integer('role_id').defaultTo(2).comment('1 = admin \n 2 = normal user')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('admin')
};

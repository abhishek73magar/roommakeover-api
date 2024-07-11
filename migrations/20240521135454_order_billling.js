/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('order_collection', (table) => {
    table.string('id', 255).primary().unique()
    table.string('fullname', 255).comment("Customer fullname for orders")
    table.string('phonenumber', 255).comment("Customer contact number")
    table.string('address', 255).comment("customer address name")
    table.text('other_details').comment("More details for address area")
    table.integer('deliver_at').defaultTo(1).comment(" 0 = office \n 1 = house")
    table.string("email", 255).comment('Customer email id')
    table.string('user_id', 255).notNullable()
    table.timestamp('create_at', { useTz: true, }).defaultTo(knex.fn.now())
    // table.string("order_collection_id", 255).comment("Customer order collection id")

    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE')
    // table.foreign('order_collection_id').references('collection_id').inTable('orders').onDelete("CASCADE").onUpdate('CASCADE')
  }).then(() => {
    return knex.schema.alterTable('orders', (table) => {
      table.dropColumns(['user_id', 'address_id', 'deliver_at', 'category'])
      table.foreign('collection_id').references('id').inTable('order_collection').onDelete('CASCADE').onUpdate('CASCADE')
    })
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('orders', (table) => {
    table.dropForeign('collection_id')
    table.string('user_id', 255)
    table.string('category', 255)
    table.integer('deliver_at').defaultTo(1).comment(" 0 = office \n 1 = house")
    table.bigInteger('address_id')
  }).then(() => knex.schema.dropTable('order_collection'))
};

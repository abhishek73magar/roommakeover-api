/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('order_invoice', (table) => {
    table.bigIncrements('id').primary()
    table.string('collection_id', 255).comment("order collection id")
    table.specificType('orders', 'varchar[]').defaultTo('{}').comment("all orders ids")
    table.integer('shipping_charge').defaultTo(0).comment("Shipping charge if necessary")
    table.integer('discount').defaultTo(0).comment("discount price if necessary")
    // table.bigint('total').comment("Total price of listed orders product")
    table.timestamp('create_at', { useTz: true }).defaultTo(knex.fn.now())
    table.timestamp('paid_at', { useTz: true }).nullable().defaultTo(knex.raw('NULL'))
    table.string('status', 1).defaultTo('0').comment("status \n 0 = unpaid, 1 = paid")
    table.string('user_id', 255).comment("User id")

    table.foreign('collection_id').references('id').inTable('order_collection').onDelete('SET NULL').onUpdate('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE')
  }).then(() => {
    // id start from 1000
    return knex.raw("ALTER SEQUENCE order_invoice_id_seq RESTART WITH 1000")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('order_invoice')
};

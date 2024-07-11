/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('payment_transaction', (table) => {
    table.bigIncrements('id').primary()
    table.string('transaction_code', 255).notNullable()
    table.string('transaction_uuid', 255).notNullable()
    table.bigint('invoice_id').notNullable()
    table.string('collection_id')
    table.double('amount').notNullable()
    table.string('gateway', 1).notNullable().comment(' 1 = esewa \n 2 = khalti \n 3 = fonepay \n 0 = unknown ')
    table.timestamp('create_at', { useTz: true }).defaultTo(knex.fn.now())
    table.string('status', 1).defaultTo('0').comment('1 = complete \n 0 = trasaction error')

    table.foreign('collection_id').references('id').inTable('order_collection').onDelete('SET NULL').onUpdate('CASCADE')
    table.foreign('invoice_id').references('id').inTable('order_invoice').onDelete('SET NULL').onUpdate('CASCADE')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("payment_transaction")
};

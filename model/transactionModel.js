const knex = require("../db")

const get = (invoice_id) => {
  return knex('payment_transaction').where({ invoice_id })
}


module.exports = { get }
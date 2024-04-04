const knex = require("../../db")

exports.getCustomerModel = () => {
  return knex('users')
}

exports.deleteCustomerModel = (id) => {
  return knex('users').where({ id }).delete()
}
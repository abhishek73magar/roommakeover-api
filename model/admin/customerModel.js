const knex = require("../../db")

exports.getCustomerModel = () => {
  return knex('users')
}
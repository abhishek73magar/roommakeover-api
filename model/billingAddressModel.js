const knex = require("../db");

exports.addBillingAddressModel = (body, user) => {
  body.user_id = user.id;
  return knex("billing_address").insert(body).returning("*").then(([result]) => result);
};

exports.updateBillingAddressModel = (body, id, user) => {
  return knex("billing_address")
          .where("id", id).andWhere("user_id", user.id)
          .update(body).returning("*")
          .then(([result]) => result)
};

exports.getBillingAddressModel = (user) => {
  return knex("billing_address").where("user_id", user.id);
};

exports.getActiveBillingAddressModel = (user) => {
  return knex("billing_address")
    .where("user_id", user.id)
    .andWhere("status", "active");
};

exports.getBillingAddressByIdModel = (id, user) => {
  return knex("billing_address").where("id", id).andWhere("user_id", user.id);
};

exports.deleteBillingAddressModel = (id, user) => {
  return knex("billing_address")
    .where("id", id)
    .andWhere("user_id", user.id)
    .delete();
};  

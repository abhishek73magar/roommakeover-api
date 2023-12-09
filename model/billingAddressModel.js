const knex = require("../db");

exports.addBillingAddressModel = (body, user) => {
  body.user_id = user.id;
  return knex("billing_address").insert(body);
};

exports.updateBillingAddressModel = (body, id, user) => {
  return new Promise(async (resovle, reject) => {
    try {
      // if (body.hasOwnProperty("status") && body.status === "active") {
      //   await knex("billing_address")
      //     .where("user_id", user.id)
      //     .andWhere("status", "active")
      //     .update({ status: "inactive" });
      // }

      await knex("billing_address").where("id", id).andWhere("user_id", user.id).update(body);
      return resovle("Billing address updated");
    } catch (error) {
      console.log(error)
      return reject(error);
    }
  });
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

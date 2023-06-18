const { uid } = require("uid");
const knex = require("../db");
const { removeFile } = require("../libs/removeFile");

exports.addBrandModel = (body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      body.id = uid(10);
      body.logo = "";
      body.originalname = "";
      if (file) {
        body.logo = `brands/${file.filename}`;
        body.originalname = file.originalname;
      }

      await knex("brands").insert(body);
      return resolve("Brand added");
    } catch (error) {
      if (file) {
        removeFile(`brands/${file.filename}`);
      }
      return reject(error);
    }
  });
};

exports.updateBrandModel = (id, body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        body.logo = `brands/${file.filename}`;
        body.originalname = file.originalname;
      }

      await knex("brands").where("id", id).update(body);
      return resolve("Brand updated");
    } catch (error) {
      if (file) {
        removeFile(`brands/${file.filename}`);
      }
      return reject(error);
    }
  });
};

exports.getBrandModel = () => {
  return knex("brands");
};

exports.getBrandByIdModel = (id) => {
  return knex("brands").where("id", id);
};

exports.deleteBrandModel = (id) => {
  return knex("brands").where("id", id).delete();
};

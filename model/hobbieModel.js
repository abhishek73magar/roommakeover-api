const knex = require("../db");
const { removeFile } = require("../libs/removeFile");

exports.addHobbieModel = (body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        body.originalname = file.originalname;
        body.url = `hobbie-image/${file.filename}`;
      }

      await knex("hobbies").insert(body);
      return resolve("New hobbie added");
    } catch (error) {
      if (file) removeFile(`hobbie-image/${file.filename}`);
      return reject(error);
    }
  });
};

exports.updateHobbieModel = (body, file, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        body.originalname = file.originalname;
        body.url = `hobbie-image/${file.filename}`;
      }

      const [hobbie] = await knex("hobbies").where("id", id);
      if (hobbie) removeFile(hobbie.url);

      await knex("hobbies").insert(body);
      return resolve("New hobbie added");
    } catch (error) {
      if (file) removeFile(`hobbie-image/${file.filename}`);
      return reject(error);
    }
  });
};

exports.getHobbieModel = () => {
  return knex("hobbies");
};

exports.getHobbieByIdModel = (id) => {
  return knex("hobbies").where("id", id);
};

exports.deleteHobbieModel = (id) => {
  return knex("hoobies_list").where("id", id).delete();
};

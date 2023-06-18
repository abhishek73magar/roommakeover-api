const knex = require("../db");
const { removeFile } = require("../libs/removeFile");

exports.addCategoryModel = (body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      body.imagesrc = "";
      if (file) {
        body.imagesrc = `categorysbg/${file.filename}`;
      }
      await knex("categorys").insert(body);
      return resolve("New Category added");
    } catch (error) {
      if (file) {
        const path = `categorybg/${path}`;
        removeFile(path);
      }
      return reject(error);
    }
  });
};

exports.updateCategoryModel = (body, file, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        body.imagesrc = `categorysbg/${file.filename}`;
        const [category] = await knex("categorys").where("id", id);
        removeFile(category.filename);
      }
      await knex("categorys").where("id", id).update(body);
      return resolve("Category Updated");
    } catch (error) {
      if (file) {
        const path = `categorybg/${path}`;
        removeFile(path);
      }
      return reject(error);
    }
  });
};

exports.getCategoryModel = () => {
  return knex("categorys");
};

exports.getCategoryByIdModel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [category] = await knex("categorys").where("id", id);
      return resolve(category);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.deleteCategoryModel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [category] = await knex("categorys").where("id", id);
      if (!category) return reject("Category not found");
      return await knex.transaction((tnx) => {
        return knex("category")
          .transacting(tnx)
          .where("id", id)
          .delete()
          .then(() => {
            removeFile(category.imagesrc);
            tnx.commit();
            return resolve("Category removed");
          })
          .catch(tnx.rollback)
          .catch((err) => reject(err));
      });
    } catch (error) {
      return reject(error);
    }
  });
};

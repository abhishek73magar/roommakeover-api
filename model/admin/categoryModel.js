const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addCategoryForAdminModel = (body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      body.imagesrc = "";

      if (file) { body.imagesrc = `categorysbg/${file.filename}` }
      if(body.category_id === '') body.category_id = null;

      await knex("categorys").insert(body);
      return resolve("New Category added");
    } catch (error) {
      if (file) { removeFile(`categorybg/${file.filename}`) }
      console.log(error);
      return reject(error);
    }
  });
};

exports.updateCategoryForAdminModel = (body, file, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      if(body.category_id === '') body.category_id = null;
      if (file) {
        body.imagesrc = `categorysbg/${file.filename}`;
        const [category] = await knex("categorys").where("id", id);
        removeFile(category.imagesrc);
      }
      await knex("categorys").where("id", id).update(body);
      return resolve("Category Updated");
    } catch (error) {
      console.log(error);
      if (file) {
        const path = `categorybg/${file.filename}`;
        removeFile(path);
      }
      return reject(error);
    }
  });
};

exports.getCategoryForAdminModel = () => {
  return knex("categorys");
};

exports.getCategoryForAdminByIdModel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [category] = await knex("categorys").where("id", id);
      return resolve(category);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.deleteCategoryForAdminModel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [category] = await knex("categorys").where("id", id);
      if (!category) return reject("Category not found");
      return await knex.transaction((tnx) => {
        return knex("categorys")
          .transacting(tnx)
          .where("id", id)
          .delete()
          .then(() => {
            if (category.imagesrc !== "") removeFile(category.imagesrc);
            return tnx.commit();
          })
          .then(() => resolve("Category Removed"))
          .catch(tnx.rollback)
          .catch((err) => reject(err));
      });
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

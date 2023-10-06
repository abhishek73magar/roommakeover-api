const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addAdminCategoryModel = (body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      body.imagesrc = "";
      // console.log(body, file);
      if (file) { body.imagesrc = `categorysbg/${file.filename}` }
      // console.log(body)
      await knex("categorys").insert(body);
      return resolve("New Category added");
    } catch (error) {
      if (file) { removeFile(`categorybg/${file.filename}`) }
      console.log(error);
      return reject(error);
    }
  });
}


exports.updateAdminCategoryModel = (body, file, id) => {
  return new Promise(async (resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      if(body.category_id === '') body.category_id = null;
      if (file) {
        body.imagesrc = `categorysbg/${file.filename}`;
        const [category] = await knex("categorys").where("id", id);
        removeFile(category.imagesrc);
      }
      await tnx("categorys").where("id", id).update(body);
      await tnx.commit();

      return resolve("Category Updated");
    } catch (error) {
      await tnx.rollback();
      console.log(error);
      if (file) { removeFile(`categorybg/${file.filename}`) }
      return reject(error);
    }
  });
};

exports.getAdminCategoryModel = () => {
  return knex('categorys')
}


exports.getAdminCategoryByIdModel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [category] = await knex("categorys").where("id", id);
      return resolve(category);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.deleteAdminCategoryModel = (id) => {
  return new Promise(async (resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      const [category] = await knex("categorys").where("id", id);
      if (!category) return reject("Category not found");

      await tnx('categorys').where('id', id).delete();
      if(category.imagesrc !== '') removeFile(category.imagesrc)

      await tnx.commit();
      return resolve("Category Removed")
    } catch (error) {
      await tnx.rollback();
      console.log(error);
      return reject(error);
    }
  });
};
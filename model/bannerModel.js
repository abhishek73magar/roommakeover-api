const knex = require("../db");
const { removeFile } = require("../libs/removeFile");

exports.addBannerModel = (body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        body.url = `banners/${file.filename}`;
        body.originalname = file.originalname;
      }

      const [banner] = await knex("banners").where("type", body.type);
      if (banner) {
        removeFile(banner.url);
        await knex("banners").where("type", body.type).update(body);
        return resolve("Banner updated");
      }

      await knex("banners").insert(body);
      return resolve("Banner Added");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.updateBannerModel = (body, file, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [banner] = await knex("banners").where("type", type);
      if (file) {
        if (banner.url !== "") removeFile(banner.url);
        body.url = `banners/${file.filename}`;
        body.originalname = file.originalname;
      }

      await knex("banners").update(body);
      return resolve("update Banner");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getBannerModel = () => {
  return knex("banners");
};

exports.getBannerByTypeModel = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [banner] = await knex("banners").where("type", type);
      return resolve(banner);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.deleteBannerModel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [banner] = await knex("banners").where("id", id);
      if (!banner) return reject("Banner is not found !");
      return await knex.transaction((tnx) => {
        return knex("banner")
          .transacting(tnx)
          .where("id", id)
          .delete()
          .then(() => removeFile(banner.url))
          .then(tnx.commit)
          .then(() => resolve("banner removed"))
          .catch(trx.rollback)
          .catch((err) => reject(err));
      });
    } catch (error) {
      return reject(error);
    }
  });
};

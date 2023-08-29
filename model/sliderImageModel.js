const knex = require("../db");
const { removeFile } = require("../libs/removeFile");

exports.addSliderImageModel = (files) => {
  return new Promise(async (resolve, reject) => {
    try {
      const obj = files.map((file) => {
        const name = file.filename;
        const originalname = file.originalname;
        const url = `slider-images/${name}`;
        return { name, originalname, url };
      });

      await knex("slider_images").insert(obj);
      return resolve("Slider images added");
    } catch (error) {
      if (files) {
        files.forEach((file) => {
          removeFile(`slider-images/${file.filename}`);
        });
      }
      return reject(error);
    }
  });
};

exports.getSliderImageModel = () => {
  return knex("slider_images");
};

exports.deleteSliderImagesModel = (id) => {
  return knex("slider_images").where("id", id).delete();
};

const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addSliderImageModel = async(body, files) => {
  try {
    if(files.length === 0) throw "files not found !"
    const obj = files.map((file) => {
      const name = file.filename;
      const originalname = file.originalname;
      const url = `slider-images/${name}`;
      return { name, originalname, url, type: body.type || null };
    });

    const sliderImages = await knex("slider_images").insert(obj).returning('*');
    return sliderImages;
  } catch (error) {
    console.log(error)
    if (files) { files.forEach((file) => removeFile(`slider-images/${file.filename}`) ) }
    return error;
  }
}

exports.getSliderImageModel = () => {
  return knex('slider_images')
}


exports.deleteSliderImageModel = async(id) => {
  try {
    
    const [sliderImage] = await knex('slider_images').where({ id }).delete().returning("*")
    if(sliderImage) removeFile(sliderImage.url)
    
    return "Slider Image removed"
  } catch (error) {
    console.log(error)
    return error
  }
}
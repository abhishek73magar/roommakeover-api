const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addMediaModel = async(files) => {
  try {
    const obj = files.map((file) => {
      const name = file.originalname;
      const url = `media/${file.filename}`
      return { name, url }
    })
    const [media] = await knex('blogs_media').insert(obj).returning("*")
    return media

  } catch (error) {
    console.log(error)
    if(Array.isArray(files)) {
      files.forEach((file) => removeFile(`media/${file.filename}`))
    }
    return error;
  }
}

 
exports.getMediaModel = () => {
  return knex('blogs_media')
}

exports.deleteMediaModel = async(id) => {
  try {
    const [media] = await knex('blogs_media').where('id', id)
    await knex('blogs_media').where('id', id).delete()
    removeFile(media.url) 
    return "Media removed successfully"  
  } catch (error) {
    return error
  }
}
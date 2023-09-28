const knex = require("../../db")
const { removeFile } = require("../../libs/removeFile")

exports.addHobbieForAdminModel = (body, files) => {
  return new Promise(async(resolve, reject) => {
    try {
      const obj = { ...body }
      const [hobbie] = await knex('hobbies').where('title', body.title)
      if(hobbie) return reject("Hobbie name already exist !")

      if(files && Array.isArray(files) && files.length !== 0) {
        obj['thumbnail'] = "hobbies/" + files[0].filename
        obj['originalname'] = files[0].originalname

      }

      await knex('hobbies').insert(obj)
      return resolve("Hobbie added")
    } catch (error) {
      console.log(error)
      if (files) {
        const path = 'hobbies/' + files[0].filename;
        removeFile(path);
      }
      return reject(error)
    }
  })
}

exports.updateHobbieForAdminModel = (body, files, id) => {
  return new Promise(async(resolve, reject) => {
    try {
      const obj = { ...body }
      if(files && Array.isArray(files) && files.length !== 0) {
        obj['thumbnail'] = "hobbies/" + files[0].filename
        obj['originalname'] = files[0].originalname
        
        const [hobbie] = await knex('hobbies').where('id', id)
        removeFile(hobbie.thumbnail)
      }

      await knex('hobbies').where("id", id).update(obj)
      return resolve("Hobbie updated")
    } catch (error) {
      if (files) {
        const path = 'hobbies/' + files[0].filename;
        removeFile(path);
      }
      return reject(error)
    }
  })
}

exports.getHobbieForAdminModel = () => {
  return knex('hobbies').orderBy('id', 'desc')
}

exports.getHobbieByIdForAdminModel = (id) => {
  return knex('hobbies').where("id", id)
}

exports.deleteHobbieByIdForAdminModel = (id) => {
  return new Promise(async(resolve, reject) => {
    try {
      const [hobbie] = await knex('hobbies').where('id', id)

      await knex('hobbies').where('id', id).delete();
      removeFile(hobbie.thumbnail)
      return resolve("Hobbie removed")
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}
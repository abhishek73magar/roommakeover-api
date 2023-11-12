const knex = require("../db")

module.exports = async() => {
  try {
    const response = await knex('categorys')
    console.log(response)
    const newCategory = response.map((item) => {
      item.imagesrc = item.imagesrc.replace('categorysbg', "category")
      return item;
    })
    newCategory.forEach(async(item) => {
      // await knex('categorys').where("id", item.id).update(item)
    })
    // console.log(newCategory)
  } catch (error) {
    console.log(error)
  }
}
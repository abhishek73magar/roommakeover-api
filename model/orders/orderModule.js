const knex = require("../../db")

exports.getOrderForAdminModel = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const orders = await knex('orders').orderBy("date", 'desc')
      return resolve(orders)
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.getOrderByIdForAdminModel = (collection_id) => {
  return new Promise(async(resolve, reject) => {
    try {
      const query = `
        SELECT a.*, b.url FROM orders as a 
        INNER JOIN product_images AS b ON a.product_id=b.product_id 
        WHERE a.collection_id=?
        `
      const { rows } = await knex.raw(query, [collection_id])
      const [billing] = await knex('billing_address').where('user_id', rows[0].user_id).andWhere('status', 'active')
      rows[0].billing = billing;
      return resolve(rows[0])
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.updateOrderForAdminModel = (body, collection_id) => {
  return new Promise (async(resolve, reject) => {
    try {
      await knex('orders').where('collection_id', collection_id).update(body)
      return resolve('order updated')
    } catch (error) {
      return reject(error)
    }
  })
}
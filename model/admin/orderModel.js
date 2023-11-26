const knex = require("../../db")

exports.getOrderForAdminModel = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const orders = await knex('orders').orderBy("date", 'DESC')
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
      if(rows.length === 0) return reject("Order not found !")
      const [billing] = await knex('billing_address').where('user_id', rows[0].user_id).andWhere("id", rows[0].address_id)
      return resolve({ orders: rows, billing })
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.updateOrderForAdminModel = (body, query) => {
  return new Promise (async(resolve, reject) => {
    try {
      if(query.hasOwnProperty('collection_id')){
        await knex('orders').where('collection_id', query.collection_id).update({ ...body, status_datetime: new Date().toISOString() })
      } else if(query.hasOwnProperty("order_id")) { 
        await knex('orders').where('id', query.order_id).update({ ...body, status_datetime: new Date().toISOString() })
      } else {
        return reject("Order not found !")
      }
      return resolve('order updated')


      
    } catch (error) {
      return reject(error)
    }
  })
}
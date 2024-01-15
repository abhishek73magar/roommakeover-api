const knex = require("../../db")

exports.getOrderForAdminModel = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const orders = await knex('orders').orderBy("date", 'DESC')

      const newOrderList = orders.reduce((prev, curr) => {
        const order = prev.find(item => item.collection_id === curr.collection_id)
        if(order) { order.total_product += 1; order.total_price += curr.qty * curr.price }
        else { prev.push({ ...curr, total_product: 1, total_price: curr.qty * curr.price }) }
        return prev;
      }, [])

      const orderLength = newOrderList.length;
      for(let i = 0; i < orderLength; i++){
        const order = newOrderList[i]
        const [billing] = await knex('billing_address').where('id', order.address_id).returning("fullname")
        order.fullname = billing.fullname
      }

      return resolve(newOrderList)
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
        SELECT a.*, (
          SELECT pi.url from product_images pi where pi.product_id=a.product_id LIMIT 1
        ) as url 
        FROM orders a
        WHERE collection_id=?
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
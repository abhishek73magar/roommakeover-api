const knex = require("../../db")
const _ = require('loadsh')

exports.getOrderForAdminModel = async() => {
    try {
      const query = `
        SELECT *, (
          SELECT array_agg(
            json_build_object(
              'id', id,
              'collection_id', collection_id,
              'product_id', product_id,
              'title', title,
              'price', price,
              'qty', qty,
              'product_option', product_option,
              'date', date,
              'review', review,
              'status', status,
              'status_datetime', status_datetime,
              'color', color,
              'image', (
                SELECT json_build_object(
                  'url', url,
                  'alt', originalname
                ) FROM product_images pi WHERE pi.product_id=o.product_id LIMIT 1
              )
            )
          ) FROM orders as o WHERE o.collection_id=oc.id
        ) as orders FROM order_collection oc ORDER BY create_at DESC
      `

      const { rows } = await knex.raw(query)
      // console.log(rows)
      // const result = _(rows).groupBy('collection_id').map((item, key) =>{
      //   const total_product = item.length;
      //   const total_price = item.reduce((prev, curr) => prev + (curr.qty * curr.price), 0)
      //   const fullname = item[0].fullname
      //   // const date = item[0].date
      //   return ({ collection_id: key, fullname, total_product, total_price, orders: item })
      // }).value()

      return rows
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
}

exports.getOrderByIdForAdminModel = async(collection_id) => {
    try {
      const query = `
      SELECT *, (
        SELECT array_agg(
          json_build_object(
            'id', id,
            'collection_id', collection_id,
            'product_id', product_id,
            'title', title,
            'price', price,
            'qty', qty,
            'product_option', product_option,
            'date', date,
            'review', review,
            'status', status,
            'status_datetime', status_datetime,
            'color', color,
            'url', (
              SELECT url FROM product_images pi WHERE pi.product_id=o.product_id LIMIT 1
            ),
            'payment_status', (
              SELECT pt.status FROM order_invoice oi
              JOIN payment_transaction pt ON pt.invoice_id=oi.id 
              WHERE pt.collection_id=oc.id AND o.id=ANY(oi.orders)
              LIMIT 1
            )
          )
        ) FROM orders as o WHERE o.collection_id=oc.id
      ) as orders FROM order_collection oc WHERE oc.id=? 
    `
      const { rows } = await knex.raw(query, [collection_id])
      if(rows.length === 0) return reject("Order not found !")
      return rows[0]
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
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

exports.deleteOrderByIdModel = async(id) => {
  try {
    const [order] = await knex('orders').where({ id }).delete().returning("id")
    return order
  } catch (error) {
    // console.log()
    return Promise.reject(error)
  }
}
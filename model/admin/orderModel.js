const knex = require("../../db")
const _ = require('loadsh')
const genPwd = require("generate-password");
const { uid } = require("uid");
const bcrypt = require('bcrypt')

exports.createOrder = async(body, admin) => {
  const tnx = await knex.transaction()
  try {
    // console.log(admin)
    let [user] = await tnx('users').where({ email: body.email })
    if(!user) {
      const fullname = body.fullname.split(' ')
      const salt = bcrypt.genSaltSync(10);
      const password = genPwd.generate({ strict: true });
      const hashPassword = bcrypt.hashSync(password, salt);
      const payload = {
        id: uid(10),
        firstname: fullname[0],
        lastname: fullname.slice(1,).join(' '),
        email: body.email,
        password: hashPassword
      }
      const [user1] = await tnx('users').insert(payload).returning('*')
      user = user1
    }
    const { products } = body
    if(!Array.isArray(products) || products.length === 0) throw new Error("Product not found !! Please select one.")
    const order_collection = { ...body, user_id: user.id, create_by: admin.id }
    delete order_collection.products;
    const [collection] = await tnx('order_collection').insert(order_collection).returning('*')
    const orders = await tnx('orders').insert(products.map((item) => ({...item, collection_id: collection.id }))).returning('*')

    // throw new Error("Not impliment")
    await tnx.commit()
    return { ...collection, orders, create_by: admin.fullname };
  } catch (error) {
    console.log(error.message ?? error)
    await tnx.rollback()
    return Promise.reject(error.message ?? error)
  }
}


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
      console.log(error.message ?? error)
      return Promise.reject(error)
    }
}

exports.getOrderByIdForAdminModel = async(collection_id) => {
    try {
      const query = `
      SELECT *, 
      (SELECT fullname from admin WHERE id = oc.create_by LIMIT 1) as create_by,
      (
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
              WHERE pt.collection_id=oc.id AND o.id::bigint=ANY(oi.orders)
              LIMIT 1
            )
          )
        ) FROM orders as o WHERE o.collection_id=oc.id::bigint
      ) as orders FROM order_collection oc WHERE oc.id=? 
    `
      const { rows } = await knex.raw(query, [collection_id])
      if(rows.length === 0) return reject("Order not found !")
      return rows[0]
    } catch (error) {
      console.log(error.message ?? error)
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
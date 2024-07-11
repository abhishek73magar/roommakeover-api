const { uid } = require("uid");
const knex = require("../db");
const { orderMail } = require("../libs/orderMail");

exports.addOrderModel = async(body, user) => {
    const tnx = await knex.transaction();
    try {
      const collection_id = uid(10);
      const obj = body.map((val) => {
        return {...val, id: uid(10), collection_id };
      });
      // console.log(obj);
      // billing address
      const [billing] = await knex('billing_address').where({ user_id: user.id })
      if(!billing) throw "Billing address not found !!"
      billing.id = collection_id
      billing.user_id = user.id


      await tnx('order_collection').insert(billing)
      await tnx('orders').insert(obj)
      await tnx('checkout').where('user_id', user.id).delete();

      await tnx.commit();
      // orderMail(obj).catch(err => console.log(err.message ?? err))
      return 'Order send'
    } catch (error) {
      console.log(error.message ?? error);
      await tnx.rollback();
      return Promise.reject(error);
    }
};

exports.updateOrderModel = (body, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await knex("orders").where("collection_id", id).update(body);
      return resolve("Order Updated");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getOrdersModel = async(user) => {
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
      ) as orders FROM order_collection oc WHERE user_id=? ORDER BY create_at DESC
    `

    const { rows: orders } = await knex.raw(query, [user.id])
    return orders; 
  } catch (error) {
    console.log(error.message ?? error);
    return Promise.reject(error);
  }
};

exports.getOrderByIdModel = async(collection_id, user) => {
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
              ),
              'payment_status', (
                SELECT pt.status FROM order_invoice oi
                JOIN payment_transaction pt ON pt.invoice_id=oi.id 
                WHERE pt.collection_id=oc.id AND o.id=ANY(oi.orders)
                LIMIT 1
              )
            )
          ) FROM orders as o WHERE o.collection_id=oc.id
        ) as orders FROM order_collection oc WHERE user_id=? AND id=?
      `
      const { rows: orders } = await knex.raw(query, [user.id, collection_id])

      if(orders.length === 0) throw "Order not found !"
      return orders[0];
    } catch (error) {
      console.log(error.message ?? error)
      return Promise.reject(error);
    }
};

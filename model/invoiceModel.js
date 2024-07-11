const knex = require("../db");


const get = (user) => {
  const query = `
    SELECT oi.*, (
        SELECT sum((o.qty * o.price)) FROM orders o 
        WHERE o.id = ANY(oi.orders)
    ) + (oi.shipping_charge - oi.discount) as total FROM order_invoice oi WHERE  user_id = ?
  ` 
  return knex.raw(query, [user.id]).then(({ rows }) => rows);
};

// const getById = (id) => {
//   return knex("order_invoice").where({ id });
// };

const getByCollectionId = (collection_id) => {
   const query = `
    SELECT oi.*, (
        SELECT sum((o.qty * o.price) + oi.shipping_charge + oi.discount) FROM orders o 
        WHERE o.id = ANY(oi.orders)
    ) as total FROM order_invoice oi WHERE collection_id=?
   ` 
   return knex.raw(query, [collection_id]).then(({ rows }) => rows)
}

const getById = (id, user) => {
  const query = `
    SELECT oi.*, (
      SELECT array_agg(
        json_build_object(
          'id', id,
          'title', title,
          'qty', qty,
          'price', price,
          'url', (  
            SELECT url FROM product_images pi WHERE pi.product_id=o.product_id LIMIT 1
          )
        )
      ) FROM orders o WHERE o.id = ANY(oi.orders)
    ) as orders,
    (
      SELECT json_build_object(
        'fullname', fullname,
        'phonenumber', phonenumber,
        'email', email,
        'address', address,
        'other_details', other_details,
        'deliver_at', deliver_at,
        'create_at', create_at
      ) FROM order_collection oc WHERE oc.id=oi.collection_id
    ) as billing
    FROM order_invoice oi 
    WHERE id=? AND user_id=?
  `
  // console.log('invoice_id')
  return knex.raw(query, [id, user.id]).then(({ rows }) => rows[0] ?? null)
}

module.exports = { get, getById, getByCollectionId }
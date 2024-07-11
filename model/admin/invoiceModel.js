const knex = require("../../db");

const create = (body) => {
  return knex("order_invoice").insert(body).returning("*").then(res => res[0] ?? null)
};

const get = () => {
  const query = `
    SELECT *, 
    ( SELECT firstname FROM users u WHERE u.id = oi.user_id LIMIT 1 ) as user 
    FROM order_invoice oi
  `
  return knex.raw(query).then(({ rows }) => rows);
};

const getById = (id) => {
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
    WHERE id=?
  `
  // console.log('invoice_id')
  return knex.raw(query, [id]).then(({ rows }) => rows[0] ?? null)
};

const getByCollectionId = (collection_id) => {
   const query = `
   SELECT oi.*, (
      SELECT sum((o.qty * o.price)) FROM orders o 
      WHERE o.id = ANY(oi.orders)
    ) + (oi.shipping_charge - oi.discount) as total FROM order_invoice oi WHERE collection_id=?
   ` 
   return knex.raw(query, [collection_id]).then(({ rows }) => rows)
}

const remove = async(id) => {
  try {
    const [invoice] = await knex('order_invoice').where({ id })
    if(invoice.status === "1") throw new Error("Paid Invoice cannot be deleted")
    await knex("order_invoice").where({ id }).delete().then(() => "Invoice Removed !!");
    return "Invoice Removed !!"
  } catch (error) {
    return Promise.reject(error.message ?? error)
  }
};


module.exports = { create, get, getById, getByCollectionId, remove }
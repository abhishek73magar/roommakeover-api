const { uid } = require("uid")
const knex = require("../../db")

const get = () => {
  return knex('payment_transaction').orderBy('create_at', 'desc')
}


const getByInvoiceId = (invoice_id) => {
  return knex('payment_transaction').where({ invoice_id })
}

const update = async(body, invoice_id) => {
  const tnx = await knex.transaction()
  try {
    const transaction_uuid = `trx_${uid(5)}_${invoice_id}`
    const { invoice_status: status } = body; 
    delete body.invoice_status

    const invoiceObject = { status }
    if(status === '1') Object.assign(invoiceObject, { paid_at: new Date() })
    const [invoice] = await tnx('order_invoice').where({ id: invoice_id }).update(invoiceObject).returning("*")
    
    Object.assign(body, { transaction_uuid, collection_id: invoice.collection_id, invoice_id })
    const [transaction] = await tnx('payment_transaction').insert(body).returning('*')

    // await tnx.rollback();
    await tnx.commit();

    return { invoice, transaction }
  } catch (error) {
    await tnx.rollback()
    console.log(error.message)
    return Promise.reject(error.message ?? error)
  }

}

module.exports = { get, getByInvoiceId, update }
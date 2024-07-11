const { uid } = require("uid");
const { ESEWA_GATEWAY_URL, ESEWA_PRODUCT_CODE, API_URL, BASE_URL, KHALTI_GATEWAY_URL, KHALTI_SERECT_KEY } = require('../config/config');
const createEsweaSignature = require('../libs/createEsweaSignature');
const knex = require('../db');
const { default: axios } = require("axios");

const esewa = async(body, invoice_id) => {
  try {
    const {amount, total, shipping_charge } = body;
    const transaction_uuid = `trx_${uid(5)}_${invoice_id}`
    // signature = this.createSignature(`total_amount=${total},transaction_uuid=${transaction_uuid},product_code=${ESEWA_PRODUCT_CODE}`)
    
    const data = {
      amount: amount || "1",
      failure_url: `${API_URL}/api/payment/esewa/failed`,
      product_delivery_charge: shipping_charge,
      product_service_charge: "0",
      product_code: ESEWA_PRODUCT_CODE,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: `${API_URL}/api/payment/esewa/callback`,
      tax_amount: "0",
      total_amount: amount ? total : (total + 1),
      transaction_uuid: transaction_uuid
    }
    // console.log(data)

    Object.assign(data, { signature: createEsweaSignature(data) })
    // const redirect_url = `https://epay.esewa.com.np/api/epay/main/v2/form` // for production
    // const redirect_url = `https://rc-epay.esewa.com.np/api/epay/main/v2/form` // for testing
    return { redirect_url: ESEWA_GATEWAY_URL,  data }

  } catch (error) {
    console.log(error.message ?? error)
    return Promise.reject(error)
  }
}


const esewaCallback = async(token) => {
  try {
    const decodeData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    // if(decodeData.status !== 'COMPLETE') throw new Error("Payment is not completed !!")

    // const message = decodeData.signed_field_names.split(',').map((field) => `${field}=${decodeData[field]}`).join(',')
    const signature = createEsweaSignature(decodeData)
  // console.log(signature === decodeData.signature)
    if(signature !== decodeData.signature) throw new Error("Payment Signature is not match !!")
    const invoice_id = decodeData.transaction_uuid.split('_').at(-1)
    const data = {
      transaction_code: decodeData.transaction_code,
      transaction_uuid: decodeData.transaction_uuid,
      status: decodeData.status === 'COMPLETE' ? '1' : '0',
      gateway: '1',
      amount: decodeData.total_amount.replace(/,/g, '')
    }
    await addPaymentTransaction(data, invoice_id)
    return `${BASE_URL}/invoice?id=${invoice_id}`
  } catch (error) {
    return Promise.reject({ message: error.message ?? error})
  }
}

const khalti = async(body, invoice_id) => {
  try {
    // console.log(body)
    const { total } = body;
    const purchase_order_id = `trx_${uid(5)}_${invoice_id}`

    const payload = {
      return_url: `${API_URL}/api/payment/khalti/callback`,
      website_url: BASE_URL,
      amount: (total * 100),
      purchase_order_id: purchase_order_id,
      purchase_order_name: 'roommakeover-product',
    }

    const request = await axios.post(`${KHALTI_GATEWAY_URL}/epayment/initiate/`, payload, {
      headers: { Authorization: `key ${KHALTI_SERECT_KEY}` }
    })

    if(request.status === 200) {
      // console.log(request.data)
      return request.data;
    }

    return null
  } catch (error) {
    console.log(error.message ?? error)
    return Promise.reject(error)
  }
}

const khaltiCallback = async(query) => {
  try {
    console.log(query)
    if(query.status.toLowerCase !== 'completed') throw new Error(query.status)
    const invoice_id = query.purchase_order_id.split('_').at(-1)

    const data = {
      transaction_code: query.transaction_code,
      transaction_uuid: query.purchase_order_id,
      status: query.status.toLowerCase() === 'completed' ? '1' : '0',
      gateway: '2',
      amount: query.total_amount.replace(/,/g, '')
    }
    
    await addPaymentTransaction(data, invoice_id)
    return `${BASE_URL}/invoice?id=${invoice_id}`;
  } catch (error) {
    return { error: error.message ?? error }
  }
}

const addPaymentTransaction = async(body, invoice_id) => {
  const tnx = await knex.transaction()
  try {
    const [{ collection_id }] = await tnx('order_invoice')
      .where({ id: invoice_id })
      .update({ status: '1', paid_at: new Date() })
      .returning('*')
    Object.assign(body, { collection_id, invoice_id })

    const [payment] = await tnx('payment_transaction').insert(body).returning('*')
    await tnx.commit()
    return payment
  } catch (error) {
    await tnx.rollback()
    return Promise.reject(error)
  }
  
}

module.exports = { esewa, esewaCallback, khalti, khaltiCallback }

const fs = require('fs')
const moment = require('moment')
const { MAIL_USER,  ADMIN_URL } = require('../config/config')
const { mailTransporter } = require('./mailTransporter')
const knex = require('../db')

exports.orderMail = async(data) => {
  try {
    const orderEmailTempalte = fs.readFileSync('mailTemplate/orderEmailTemplate.html', 'utf8')
    let orderId = ''
    const tableData = data.map((item, indx) => {
      if(indx === 0) orderId = item.collection_id
      return (`
        <tr>
          <td>${item.title}</td>
          <td>${item.qty}</td>
          <td style="min-width: 90px;">Rs ${item.price * item.qty}</td>
        </tr>
      `)      
    }).join("")

    let orderLink = `${ADMIN_URL}#/home/orders/${orderId}`
    let totalprice = data.reduce((prev, curr) => prev += curr.qty * curr.price, 0)
    
    const admin = await knex('admin')

    const emailTemplate = orderEmailTempalte
        .replace(/{{orderId}}/g, orderId)  
        .replace(/{{time}}/g, moment().format('MMMM D, YYYY'))
        .replace(/{{tableData}}/g, tableData)
        .replace(/{{totalprice}}/g, totalprice)
        .replace(/{{orderLink}}/g, orderLink)

    let subject = `[Order # ${orderId}] recieved`

    if(Array.isArray(admin) && admin.length > 0){
      const mailOptions = admin.reduce((prev, item) => {  
        if(item.order_email){
          prev.push({
            from:`Roommakeover.com.np <${MAIL_USER}> `,
            to: item.email,
            subject: subject,
            html: emailTemplate.replace(/{{adminName}}/g, item.fullname)
          })
        }
        
        return prev;
      }, [])
      // console.log(mailOptions.length)
      await mailTransporter(mailOptions, true)
    }

    
      return "Mail send successfully"

  } catch (error) {
    return Promise.reject(error)
  }
}
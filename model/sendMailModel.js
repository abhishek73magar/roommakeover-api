const mailTransporter = require("../libs/mailTransporter")

exports.sendMailModel = async(body) => {
  try {
      const mailOptions = {
        from:`Contact From ${body.email}`,
        to: process.env.MAIL_USER,
        subject:`${body.subject} from ${body.name}`,
        html: `
          <p>Name: ${body.name}</p>
          <p>Email: ${body.email}<p>
          <p>${body.text}</p>
        `
      }
  
    await mailTransporter(mailOptions)
    
    return "Mail send successfully"
  } catch (error) {
    // console.log(error)
    return Promise.reject(error)
  }
}
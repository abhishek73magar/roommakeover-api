const knex = require('../../db')
const indexList = {
  "0": "orders",
  "1": "products",
  "2": "customers",
  "3": "blogs"  
}
const moment = require('moment')
exports.homeInfoModel = async() => {
  try {
    const currentTime = moment().utc().subtract(1, 'day').format('YYYY-MM-DDT18:15:00') + '.00Z'
    const queryList = [
      `SELECT qty as a, price as b, status, date FROM orders WHERE status != 0 AND date >='${currentTime}'`,
      `SELECT COUNT(*) FROM products WHERE status='1'`,
      `SELECT COUNT(*) FROM users`,
      `SELECT COUNT(*) FROM blogs WHERE status = '1'`,
    ]

    const allPromise = await Promise.all(queryList.map((q) => knex.raw(q)))
    const response = allPromise.reduce((prev, curr, indx) => {
      if(indx === 0){
        const total = curr.rows.reduce((acc, item) => acc + (+item.a * +item.b), 0)
        prev[indexList[indx]] = total
      } else {
        const value = curr.rows[0].count
        prev[indexList[indx]] = value;
      }

      return prev;
    }, { })
    return response

  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}
const knex = require('../../db')
exports.homeInfoModel = async() => {
  try {
    const queryList = [
      `SELECT COUNT(*) FROM orders WHERE status != 0`,
      `SELECT COUNT(*) FROM products WHERE status='1'`,
      `SELECT COUNT(*) FROM users`,
      `SELECT COUNT(*) FROM blogs WHERE status = '1'`
    ]

    const allPromise = await Promise.all(queryList.map((q) => knex.raw(q)))
    const response = allPromise.reduce((prev, curr, indx) => {
      const value = curr.rows[0].count
      if(indx === 0) prev['orders'] = value
      if(indx === 1) prev['products'] = value
      if(indx === 2) prev['customers'] = value
      if(indx === 3) prev['blogs'] = value
      return prev;
    }, { })

    return response

  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}
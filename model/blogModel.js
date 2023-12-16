const knex = require("../db");

exports.getBlogModel = async(query)  => {
  try {
    const result = { data: [], total_page: 1 }
    let res = knex('blogs')
    if(query.hasOwnProperty('limit')) {
      let limit = query.limit || 5
      let offset = 0
      if(query.hasOwnProperty('pagenumber')) { offset = (query.pagenumber *  limit) - limit }
      
      const [blogs] = await knex('blogs').count();
      result["total_page"] = Math.ceil(blogs.count / limit)
      res = res.limit(limit).offset(offset)
    } 
    result['data'] = await res.orderBy('index', 'asc')
    return result
  } catch (error) {
    console.log(error)
    return error;
  }
}

exports.getBlogByTitleModel = async(title) => {
  try {
    console.log(title)
    title = title.toLowerCase().replace(/-/g, ' ').replace(/\$/g, '?')
    let query = `SELECT * FROM blogs WHERE lower(title)=?`
    const { rows } = await knex.raw(query, [title])
    if(rows.length === 0) throw "Blog not found !"
    return rows[0]
  } catch (error) {
    console.log(error)
    return error
  }
}

exports.getBlogOtherInfoModel = async(query) => {
  try {
    if(query.status === 'title'){
      const blogs = await knex('blogs').select("title")
      return blogs
    }
    return null;
  } catch (error) {
    return error
  }
}
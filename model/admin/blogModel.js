const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");


exports.addBlogModel = async(body, file) => {
  try {
    if(file) { body.thumbnail = "blog/" +  file.filename }
    await knex("blogs").insert(body)
    return "Blog add successfully"
  } catch (error) {
    console.log(error)
    if(file) { removeFile(`blog/${file.filename}`)}
    return error;
  }
}
exports.updateBlogModel = async(body, id, user) => {
  const tnx = await knex.transaction()
  try {
    if(file) { body.thumbnail = "blog/" +  file.filename }
    await knex("blogs").where('id', id).update({ ...body, update_time: new Date().toISOString() })

    if(file) {       
      const [blog] = await tnx('blogs').where('id', id)
      if(!!blog) { removeFile(blog.thumbnail) }
    }
    await tnx.commit()
    return "Blog update successfully"
  } catch (error) {
    await tnx.rollback();
    console.log(error)
    if(file) { removeFile(`blog/${file.filename}`)}

    return error;
  }
}
exports.getBlogModel = () => {
  return knex('blogs')
}

exports.getBlogByIdModel = async(id) => {
  try {
    const [blog] = await knex("blogs").where('id', id)
    if(!!blog) return blog;
    throw "Blog not found";
  } catch (error) {
    console.log(error)
    return error;
  }
}

exports.deleteBlogModel = async(id) => {
  try {
    const [blog] = await knex("blogs").where('id', id)
    if(!!blog) {
      await knex('blogs').where('id', id).delete()
      if(blog.thumbnail !== '') removeFile(blog.thumbnail)
      return "Blog removed successfully"
    }
    throw "Blog not found";
  } catch (error) {
    console.log(error)
    return error;
  }
}
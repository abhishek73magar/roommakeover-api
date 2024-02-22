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
exports.updateBlogModel = async(body, file, id) => {
  const tnx = await knex.transaction()
  try {
    const [blogImage] = await knex('blogs').where('id', id).select('thumbnail')
    if(!blogImage) throw "Blog not found !"

    if(file) { body.thumbnail = "blog/" +  file.filename  }
    const [blog] = await tnx("blogs").where('id', id).update({ ...body, update_time: new Date().toISOString() }).returning("*")
    if(blogImage.thumbnail !== '') {
      if(body.thumbnail === '' || body.thumbnail !== blogImage.thumbnail) { removeFile(blogImage.thumbnail) }
    }

    await tnx.commit()
    return blog
  } catch (error) {
    console.log(error)
    await tnx.rollback()
    if(file) { removeFile(`blog/${file.filename}`)}

    return Promise.reject(error);
  }
}
exports.getBlogModel = () => {
  return knex('blogs').orderBy('index', 'asc')
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
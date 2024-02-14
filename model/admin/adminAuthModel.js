const knex = require("../../db");
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const { genToken } = require("../../libs/token");
const { ADMIN_SECRET } = require("../../config/config");


const checkAdminUser = async() => {
  try {
    const admin = await knex('admin').where('email', 'admin@roommakeover.com.np')
    if(admin.length === 0){
      const password = bcrypt.hashSync('adminroommakeover123*#', salt)
      const obj = { fullname: "admin", email: 'admin@roommakeover.com.np', password, status: 1, role_id: 1 }
      await knex('admin').insert(obj)
      console.log('admin created successfully')
    }
    return
  } catch (error) {
    return Promise.reject(error)
  }
}

const  create = (body) => {
  body.password = bcrypt.hashSync(body.password, salt)
  return knex('admin').insert(body).returning('*')
} 

const update = (body, id) => {  
  if(body.hasOwnProperty('password')) {
    body.password = bcrypt.hashSync(body.password, salt)
  }
  return knex('admin').where({ id }).update(body)
}

const read = () => {
  return knex('admin')
}

const findById = (id) => {
  return knex('admin').where({ id })
}

const remove = (id) => {
  return knex('admin').where({ id })
}

const login = async(body) => {
  try {
    const { email, password } = body;
    const [admin] = await knex('admin').where({ email })
    if(!admin) throw "Invalid User !"

    const passwordStatus = bcrypt.compareSync(password, admin.password)
    if(!passwordStatus) throw "Invalid User !"
    delete admin.password
    const token = genToken(admin, '7d', ADMIN_SECRET)

    return token
  } catch (error) {
    return Promise.reject(error)
  }
}

module.exports = { create, update, read, findById, remove, login, checkAdminUser }

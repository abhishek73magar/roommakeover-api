const knex = require("../../db");
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const { genToken } = require("../../libs/token");
const { ADMIN_SECRET } = require("../../config/config");
const moment = require('moment')


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

const update = async(body, id) => {
  try {
    delete body.role_id
    if(body.hasOwnProperty('password')) {
      body.password = bcrypt.hashSync(body.password, salt)
    }
    const [admin] = await knex('admin').where({ id }).update(body).returning("*")
    delete admin.password
    return admin;
  } catch (error) {
    return Promise.reject(error)
  }
  
}

const read = () => {
  return knex('admin').orderBy("id", 'asc')
  .then((res) => res.map((item) => {
    delete item.password
    return item;
  }))
}

const findById = (id) => {
  return knex('admin').where({ id }).then(res => res.map((item) => { delete item.password; return item }) )

}

const remove = async(id) => {
  const tnx = await knex.transaction()
  try {
    const [admin] = await tnx('admin').where({ id }).delete().returning("role_id")
    if(admin.role_id === 1) throw "You cann't delete main admin"
    await tnx.commit()
    return "Admin removed"
  } catch (error) {
    await tnx.rollback()
    return Promise.reject(error)
  }
}

const login = async(body) => {
  try {
    const { email, password, stay } = body;
    const [admin] = await knex('admin').where({ email })
    if(!admin) throw "Invalid User !"

    const passwordStatus = bcrypt.compareSync(password, admin.password)
    if(!passwordStatus) throw "Invalid User !"
    delete admin.password
    let expires = '7d'
    if(stay) expires = '100d'
    const token = genToken(admin, expires, ADMIN_SECRET)

    return token
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

module.exports = { create, update, read, findById, remove, login, checkAdminUser }

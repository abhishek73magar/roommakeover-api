const knex = require("../db")
const genPwd = require('generate-password')
const bcrypt = require("bcrypt")
const { setCookie } = require("../libs/setCookie")
const { genToken } = require("../libs/token")
const moment = require('moment')
const { uid } = require("uid");


const expireDate = moment().add(7, "day").unix();
exports.loginWithGoogleModel = async(body, res) => {
  try {
    const [user] = await knex('users').where({ email: body.email })
    if(!!user) {
      const { id, firstname, lastname, email } = user;
        const token = genToken({ id, firstname, lastname, email }, expireDate);
        setCookie(res, "usertoken", token);
        return { token, messge: "Login Successfully" }
    }

    const id = uid(16);
    const salt = bcrypt.genSaltSync(10);
    const password = genPwd.generate({ strict: true });
    body.password = bcrypt.hashSync(password, salt);
    console.log(body)
    const [response] =  await knex("users").insert({...body, id }).returning("*");
    const { firstname, lastname, email } = response;
    
    const token = genToken({ id, firstname, lastname, email }, expireDate);
    setCookie(res, "usertoken", token);

    return { token,  messge: "User created successfully !!"}
  } catch (error) {
    
    return { error: error.messge ?? error}
  }
}


// use login with google and facebook
exports.loginWithPassportModel = async(body, res, type) => {
  try {
    if(!body.email || body.email === '') throw new Error("Email not found in social Login !!")
    
    const [user] = await knex('users').where({ email: body.email })

    if(!!user) {
      const { id, firstname, lastname, email, google_id, facebook_id } = user;
        if(type === 'google' && !google_id && !!body.google_id) await knex('users').where({ id }).update({ google_id: body.google_id })
        if(type === 'facebook' && !facebook_id && !!body.facebook_id) await knex('users').where({ id }).update({ facebook_id: body.facebook_id })
        
        const token = genToken({ id, firstname, lastname, email }, expireDate);
        setCookie(res, "usertoken", token);
        return { token, messge: "Login Successfully" }
    }

    const id = uid(16);
    const salt = bcrypt.genSaltSync(10);
    const password = genPwd.generate({ strict: true });
    body.password = bcrypt.hashSync(password, salt);
    console.log(body)
    const [response] =  await knex("users").insert({...body, id }).returning("*");
    const { firstname, lastname, email } = response;
    
    const token = genToken({ id, firstname, lastname, email }, expireDate);
    setCookie(res, "usertoken", token);

    return { token,  messge: "User created successfully !!"}
  } catch (error) {
    
    return { error: error.messge ?? error}
  }
}
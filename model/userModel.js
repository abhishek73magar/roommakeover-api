const { uid } = require("uid");
const knex = require("../db");
const bcrypt = require("bcrypt");
const { genToken } = require("../libs/token");
const genPwd = require("generate-password");
const { setCookie } = require("../libs/setCookie");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const expireDate = moment().add(1, "day").unix();

exports.signUpUserModel = (body, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = uid(16);
      const email = body.email;
      const user = await knex("users").where("email", email);
      if (user.length !== 0) return reject("Email already exist");

      delete body.cpassword;
      const salt = bcrypt.genSaltSync(10);
      body.password = bcrypt.hashSync(body.password, salt);

      const obj = { ...body, id };
      await knex.transaction((trx) => {
        return knex("users")
          .transacting(trx)
          .insert(obj)
          .then(() => {
            const { firstname, lastname, email } = body;

            console.log(expireDate);
            const token = genToken(
              { id, firstname, lastname, email },
              expireDate
            );
            setCookie(res, "usertoken", token, expireDate);
            trx.commit();
            return resolve(token);
          })

          .catch(trx.rollback)
          .catch((err) => reject(err));
      });
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.loginUserModel = (body, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email, password } = body;
      const [user] = await knex("users").where("email", email);
      if (!user) return reject("User not found");
      const compare = bcrypt.compareSync(password, user.password);
      if (!compare) return reject("Invalid user");

      const { id, firstname, lastname } = user;
      const token = genToken({ id, firstname, lastname, email }, expireDate);
      setCookie(res, "usertoken", token, expireDate);
      return resolve(token);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.loginWithSocialUserModel = (body, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [user] = await knex("users").where("email", body.email);
      if (user) {
        const { id, firstname, lastname, email } = user;
        const token = genToken({ id, firstname, lastname, email }, expireDate);
        setCookie(res, "usertoken", token, expireDate);
        return resolve(token);
      }

      const id = uid(16);
      const salt = bcrypt.genSaltSync(10);
      const password = genPwd.generate({ strict: true });
      body.password = bcrypt.hashSync(password, salt);

      await knex("users").insert(body);
      const { firstname, lastname, email } = body;

      const token = genToken({ id, firstname, lastname, email }, expireDate);
      setCookie(res, "usertoken", token, expireDate);
      return resolve(token);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.logOutUserModel = (req, res) => {
  return new Promise((resolve, reject) => {
    res.clearCookie("usertoken");
    return resolve("Logout successfully");
  });
};

exports.updateUserModel = (body, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (body.hasOwnProperty("password")) {
        const salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync(body.password, salt);
      }

      await knex("users").where("id", id).update(body);
      return resolve("User updated");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getUserModel = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await knex("users");
      users = users.map((val) => {
        delete val.password;
        return val;
      });

      return resolve(users);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getUserByIdModel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [user] = await knex("users").where("id", id);
      if (!user) return reject("User not found !");

      delete user.password;
      return resolve(user);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.verifyUserModel = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = req.cookies?.usertoken;
      if (!token) return reject({ auth: true, error: "Unauthorized user" });

      return await jwt.verify(token, process.env.SECRETKEY, (err, data) => {
        if (err) return reject({ auth: true, error: "Unauthorized user" });
        // console.log(data);
        return knex("users")
          .where("id", data.id)
          .then(([user]) => {
            // console.log(user);
            delete user.password;
            return resolve({ token, user });
          })
          .catch((err) => {
            return reject({ auth: true, error: "Unauthorized user" });
          });
      });
    } catch (error) {
      return reject({ auth: false, error });
    }
  });
};

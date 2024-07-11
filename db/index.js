const { DB_URL } = require("../config/config");

const knex = require("knex")({
  client: "postgresql",
  connection: DB_URL,
});
// console.log(DB_URL)
// const bcrypt = require("bcrypt");
knex
  .raw("SELECT 1")
  .then(() => console.log(`Database connected`))
  .catch((err) => console.log("Database is not connected", err.message));

// const userObj = {
//   email: "admin@rts.com.np",
//   role: "admin",
//   name: "Admin",
//   status: true,
//   terms: true,
// };

// knex("users")
//   .where("email", "admin@rts.com.np")
//   .then((res) => {
//     if (res.length === 0) {
//       const password = bcrypt.hashSync("admin123*#", 10);
//       Object.assign(userObj, { password });
//       knex("users")
//         .insert(userObj)
//         .then(() => console.log("admin crediantial created"))
//         .catch((err) => console.log(err));
//     }
//   })
//   .catch((err) => console.log(err));

module.exports = knex;

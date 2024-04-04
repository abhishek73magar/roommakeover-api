/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  const adminPassword = bcrypt.hashSync('roommakeover123*#', salt)
  const abhiehkPassword = bcrypt.hashSync('hunter.1014@', salt)
  await knex('admin').del()
  await knex('admin').insert([
    { fullname: "Admin", email: 'admin@roommakeover.com.np', password: adminPassword, status: 1, role_id: 1 },
    { fullname: "Abhishek Magar", email: 'aavishek60@gmail.com', password: abhiehkPassword, status: 1, role_id: 1 },
  ]);
};

const knex = require("../db");

exports.countRating = (pid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rating = await knex("reviews").where("product_id", pid);
      // if (!rating) resolve(null);
      const total = rating.reduce((prev, curr) => {
        return (prev += parseInt(curr.rating));
      }, 0);
      const ratingNum = Math.round(total / rating.length);
      return resolve(ratingNum);
    } catch (error) {
      return reject(error);
    }
  });
};

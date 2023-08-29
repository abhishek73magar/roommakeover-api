const knex = require("../db");

exports.addReviewModel = (body, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      body.user_id = user.id;
      return await knex.transaction((tnx) => {
        return knex("reviews")
          .transacting(tnx)
          .insert(body)
          .then(() => {
            return knex("orders")
              .where("id", body.order_id)
              .andWhere("user_id", user.id)
              .update({ review: 1 })
              .then(() => {
                tnx.commit();
                return resolve("Review added");
              })
              .catch(tnx.rollback)
              .catch((err) => reject(err));
          })
          .catch(tnx.rollback)
          .catch((err) => reject(err));
      });
    } catch (error) {
      return reject(error);
    }
  });
};

exports.updateReviewModel = (body, id) => {
  return knex("reviews").where("id", id).update(body);
};

exports.getReviewModel = (params, role, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = { newData: [], paginationNum: 1 };
      let data;
      if (role === "client") {
        data = knex("reviews").where("user_id", user.id);
      } else {
        data = knex("reviews");
      }

      if (params.hasOwnProperty("noofreviews")) {
        let noofreviews = params.noofreviews;
        let offset = 0;
        if (params.pagenumber) {
          offset = params.pagenumber * noofreviews - noofreviews;
        }
        const allData = await data;
        result["paginationNum"] = Math.ceil(allData.length / noofreviews);

        data = data.limit(noofreviews).offset(offset);
      }

      data = await data;
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getReviewByIdModel = (id) => {
  return knex("reviews").where("id", id);
};

exports.getReviewByProductIdModel = (pid, role, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await knex("reviews")
        .where("product_id", pid)
        .andWhere("status", "Enable");
      if (role === "client") {
        const userReview = await knex("reviews")
          .where("user_id", user.id)
          .andWhere("product_id", pid);

        let newData = data.concat(userReview);
        newData = newData.reduce((prev, curr) => {
          const check = prev.some((item) => item.id === curr.id);
          if (check) return prev;
          prev.push(curr);
          return prev;
        }, []);

        return resolve(newData);
      }
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.deleteReviewModel = (id) => {
  return knex("reviews").where("id", id).delete();
};

const { uid } = require("uid");
const knex = require("../db");
const { removeFile, removeAllFiles } = require("../libs/removeFile");

exports.addCommunityPostModel = (body, files, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      body.pid = uid(10);

      return await knex.transaction((tnx) => {
        return knex("community__post")
          .transacting(tnx)
          .insert(body)
          .then(() => {
            if (files) {
              const images = files.map((file) => {
                const url = `ourcommunity/${file.filename}`;
                const originalname = file.originalname;
                const user__id = user.id;
                return { url, originalname, product__id: body.pid, user__id };
              });
              return knex("community__post__images")
                .insert(images)
                .then(() => {
                  tnx.commit();
                  return resolve("Community added");
                })
                .catch(tnx.rollback)
                .catch((err) => reject(err));
            }
            tnx.commit();
            return resolve("Community added");
          })
          .catch((err) => reject(err));
      });
    } catch (error) {
      console.log(error);
      removeAllFiles("ourcommunity/", files);
      return reject(error);
    }
  });
};

exports.updateCommunityPostModel = (body, files, pid, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let imageList = await knex("community__post__images");
      return await knex.transaction((tnx) => {
        return knex("community__post")
          .transacting(tnx)
          .where("pid", pid)
          .update(body)
          .then(() => {
            if (files) {
              const images = files.map((file) => {
                const url = `ourcommunity/${file.filename}`;
                const originalname = file.originalname;
                const user__id = user.id;
                return { url, originalname, product__id: body.pid, user__id };
              });
              return knex("community__post__images")
                .insert(images)
                .then(() => {
                  imageList = imageList.map((image) => {
                    return { id: image.id, url: image.url };
                  });

                  return knex("community__post__images")
                    .whereIn("id", imageList.map((item) => item.id).join(","))
                    .delete()
                    .then(() => {
                      imageList.forEach((file) => {
                        removeFile(file.url);
                      });
                    })
                    .then(tnx.commit)
                    .then(() => resolve("Community update"))
                    .catch(tnx.rollback)
                    .catch((err) => reject(err));
                })
                .catch(tnx.rollback)
                .catch((err) => reject(err));
            }

            tnx.commit();
            return resolve("Community updated");
          })
          .catch((err) => reject(err));
      });
    } catch (error) {
      console.log(error);
      removeAllFiles("ourcommunity/", files);
      return reject(error);
    }
  });
};

exports.getCommunityPostModel = (params, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = { newData: [], paginationNum: 1 };

      let data = knex("community__post");
      if (!user) data = data.where("status", "onsale");
      if (user) data = data.where("user__id", user.id);

      if (params.hasOwnProperty("noofpage")) {
        let noofpage = params.noofpage;
        if (noofpage !== "all") {
          let offset = 0;
          if (params.pagenumber) {
            offset = params.pagenumber * noofpage - noofpage;
          }

          const allData = await data;
          result["paginationNum"] = Math.ceil(allData.length / noofpage);
          data = data.limit(noofpage).offset(offset);
        }
      }

      data = await data.orderBy("date", "desc");
      for (let i = 0; i < data.length; i++) {
        const post = data[i];
        const [image] = await knex("community__post__images").where(
          "product__id",
          post.pid
        );
        if (image) {
          // console.log(image, post.pid);
          post.url = image.url;
          post.alt = image.originalname;
        }
      }
      result["newData"] = data;
      return resolve(result);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.getCommunityPostByTableNameModel = (params, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { colname, value } = params;
      if (colname === "title") {
        value = value.replace(/-/g, " ");
      }

      let data = knex("community__post").where(colname, value);
      if (!user) data = data.andWhere("status", "onsale");
      if (user) data = data.andWhere("user__id", user.id);

      const communityPost = await data;

      for (let i = 0; i < communityPost.length; i++) {
        let community = communityPost[i];
        const images = await knex("community__post__images").where(
          "product__id",
          community.pid
        );
        // console.log(images);
        if (images.length !== 0) {
          community.images = images;
          community.url = images[0].url;
          community.alt = images[0].originalname;
        }
      }

      return resolve(communityPost);
    } catch (error) {
      console.log(error);
      return reject(`Internal Error: ${error}`);
    }
  });
};

exports.deleteCommunityPostModel = (pid, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const images = await knex("community__post__images").where(
        "product__id",
        pid
      );

      return await knex.transaction((tnx) => {
        return knex("community__post")
          .transacting(tnx)
          .where("pid", pid)
          .andWhere("user__id", user.id)
          .delete()
          .then(() => {
            images.forEach((image) => removeFile(image.url));
          })
          .then(tnx.commit)
          .then(() => resolve("Post removed"))
          .catch(tnx.rollback)
          .catch((err) => reject(err));
      });
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

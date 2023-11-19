const knex = require("../db");
const { removeFile } = require("../libs/removeFile");

exports.addHobbieModel = (body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        body.originalname = file.originalname;
        body.url = `hobbie-image/${file.filename}`;
      }

      await knex("hobbies").insert(body);
      return resolve("New hobbie added");
    } catch (error) {
      if (file) removeFile(`hobbie-image/${file.filename}`);
      return reject(error);
    }
  });
};

exports.updateHobbieModel = (body, file, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (file) {
        body.originalname = file.originalname;
        body.url = `hobbie-image/${file.filename}`;
      }

      const [hobbie] = await knex("hobbies").where("id", id);
      if (hobbie) removeFile(hobbie.url);

      await knex("hobbies").insert(body);
      return resolve("New hobbie added");
    } catch (error) {
      if (file) removeFile(`hobbie-image/${file.filename}`);
      return reject(error);
    }
  });
};

exports.getHobbieModel = () => {
  return knex("hobbies");
};

exports.getHobbieByNameModel = (name) => {
  return new Promise(async(resolve, reject) => {
    try {
      const query = `
          SELECT b.* FROM hobbies as a
          INNER JOIN hobbie_products as b ON a.id=b.hobbie_id WHERE LOWER(a.name)=?
        `      
      const { rows } = await knex.raw(query, [name.toLowerCase()]);
      return resolve(rows)
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
};

exports.getHobbieProductByTitleModel = (title) => {
  return new Promise(async(resolve, reject) => {
    try {
      const { rows: response } = await knex.raw(`SELECT * FROM hobbie_products WHERE LOWER(title)=?`, [title.replace(/-/g, ' ').toLowerCase()])
      if(response.legth === 0) return reject("Hobbie not found !")

      const query = `
        SELECT a.*, b.price, b.pid, c.url, c.originalname FROM hobbie_product_list AS a
        INNER JOIN products AS b ON a.product_id=b.pid
        INNER JOIN product_images AS C ON a.product_id=c.product_id  
        WHERE a.hobbie_product_id=?
      `

      const { rows } = await knex.raw(query, [response[0].id])

      const products = rows.reduce((prev, item) => {
        const check = prev.some((i) => i.product_id === item.product_id);
        if(!check) prev.push(item)
        return prev;
      }, [])  

      return resolve({ hobbie: response[0], products })

    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.deleteHobbieModel = (id) => {
  return knex("hoobies_list").where("id", id).delete();
};

import {execute} from '../../../database/db.js'

export default class itemsController {

  static async getItems(req, res) { 
    
    let limit = req.query.limit;
    let page = req.query.page;
     
    if (!req.query.limit && !req.query.page) {
      limit = 10;
      page = 1;
    }

    const offset = (page - 1) * limit;

    try {
      const { rows } = await execute(
        `SELECT * FROM items ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`
      );
      if (rows) {
        res.send({
          data: rows,
          status: true,
        });
      } else {
        res.status(500).json({
          message: "Something is wrong",
          status: false,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message,
        status: false,
      });
    }
  }

  static async createItems(req, res) {
    const { name_tk, name_en,name_ru, file_name, file_size, file_type, article_id} = req.body;
 
    let files = null 
    if (req.file) {
         files = `/uploads/` + req.file.originalname
    }

    try {
      const result = await execute(
          `INSERT INTO items (name_tk, name_en,name_ru, file_name, file_size, file_type, article_id, file)
           VALUES ($1, $2, $3, $4, $5,$6,$7,$8)`,
          [name_tk, name_en,name_ru, file_name, file_size, file_type,article_id, files]
      );
      if (result) {
        res.status(200).json({
          status: true,
          message: "Succesfully created!",
        });
      } else {
        res.status(400).json({
          message: "Bad request",
        });
      }
    } catch (err) {
      res.send(err.message);
    }
  }

  static async getOneItems(req, res) {
    const id = req.params.id
    try {
      const { rows } = await execute(
        `SELECT * FROM items WHERE id = $1`,[id]
      );
      if (rows) {
        res.send({
          data: rows[0],
          status: true,
        });
      } else {
        res.status(500).json({
          message: "Something is wrong",
          status: false,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message,
        status: false,
      });
    }
  }

  static async updateItems(req, res) {
    const { name_tk, name_en,name_ru } = req.body;
    const id = parseInt(req.params.id);
    try {
      const result = await execute(
        `UPDATE articles SET name_tk = $1, name_en = $2, name_ru = $3 WHERE id = $4`,
         [name_tk, name_en,name_ru, id]
      );
      if (result) {
        res.send({
          message: result,
          status: true,
        });
      } else {
        res.send({
          message: "Something is wrong",
          status: false,
        });
      }
    } catch (err) {
      res.send(err.message);
    }
  }

  static async deleteArticles(req, res) {
    const id = req.params.id;    
    try {
      const result = await execute(
        `DELETE FROM articles WHERE id =$1`,[id]
      );
      if (result) {
        res.status(200).send({
          message: `${id} id has been succesfully deleted`,
          status: true,
        });
      } else {
        res.status(400).send("Something is wrong");
      }
    } catch (err) {
      res.send(err.message);
    }
  }
}

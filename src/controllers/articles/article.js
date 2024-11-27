import {execute} from '../../../database/db.js'

export default class articleController {

  static async getArticle(req, res) { 
    try {
      const { rows } = await execute(
        `SELECT * FROM articles  ORDER BY created_at DESC`,
        []
      );
      if (rows) {
        return res.send({
          data: rows,
          status: true,
        });
      } else {
         return res.status(500).json({
          message: "Something is wrong",
          status: false,
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        status: false,
      });
    }
  }

  static async createArticles(req, res) {

    const { name_tk, name_en,name_ru } = req.body;
    try {
      const result = await execute(
        `INSERT INTO departments (name_tk, name_en,name_ru) VALUES ($1,$2,$3)`,
        [name_tk, name_en,name_ru ]
      );
      if (result) {
        return res.status(200).json({
          status: true,
          message: "Succesfully created!",
        });
      } else {
        return res.status(400).json({
          message: "Bad request",
        });
      }
    } catch (err) {
      return res.send(err.message);
    }
  }

  static async getOneArticles(req, res) {
    const id = req.params.id
    try {
      const { rows } = await execute(
        `SELECT * FROM articles WHERE id = $1`,[id]
      );
      if (rows) {
        return res.send({
          data: rows[0],
          status: true,
        });
      } else {
       return res.status(500).json({
          message: "Something is wrong",
          status: false,
        });
      }
    } catch (err) {
       return res.status(500).json({
        message: err.message,
        status: false,
      });
    }
  }

  static async updateArticles(req, res) {
    const { name_tk, name_en,name_ru } = req.body;
    const id = parseInt(req.params.id);
    try {
      const result = await execute(
        `UPDATE articles SET name_tk = $1, name_en = $2, name_ru = $3 WHERE id = $4`,
         [name_tk, name_en,name_ru, id]
      );
      if (result) {
        return res.send({
          message: result,
          status: true,
        });
      } else {
        return res.send({
          message: "Something is wrong",
          status: false,
        });
      }
    } catch (err) {
       return res.send(err.message);
    }
  }

  static async deleteArticles(req, res) {
    const id = req.params.id;    
    try {
      const result = await execute(
        `DELETE FROM articles WHERE id =$1`,[id]
      );
      if (result) {
        return res.status(200).send({
          message: `${id} id has been succesfully deleted`,
          status: true,
        });
      } else {
        return res.status(400).send("Something is wrong");
      }
    } catch (err) {
      return res.send(err.message);
    }
  }
}

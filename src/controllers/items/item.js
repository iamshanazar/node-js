import {execute} from '../../../database/db.js'

export default class itemsController {

  static async getItems(req, res) { 
    
    let limit = req.query.limit;
    let page = req.query.page; 
    let id = req.query.teacher_id

    if (!req.query.limit && !req.query.page) {
      limit = 10;
      page = 1;
    }
    const offset = (page - 1) * limit;
    try {
      const { rows } = await execute(
        `SELECT * FROM items WHERE teacher_id =$1 ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`[id]
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
   const { name_tk, name_en,name_ru, file_name, file_size, file_type} = req.body;

    const id = parseInt(req.params.id);
    
    let files = "";
    if (req.file) {
      files = `/uploads/` + req.file.originalname;
    }
    
    try { 
        const result = await execute(
           files 
              ? `UPDATE items SET 
                name_tk=$1, name_en=$2, name_ru=$3, file_name=$4, file_size=$5, file_type=$6, image = $7 WHERE id =$8`
              : `UPDATE competitions SET 
              name_tk=$1, name_en=$2, name_ru=$3, file_name=$4, file_size=$5, file_type=$6 WHERE id =$7`,
           files 
              ? [name_tk, name_en, name_ru, file_name, file_size, file_type, files, id]
              : [name_tk, name_en, name_ru, file_name, file_size, file_type]
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

  static async deleteItems(req, res) {
    const id = req.params.id;    
    try {
      const result = await execute(
        `DELETE FROM WHERE id =$1`,[id]
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

import {execute} from '../../../database/db.js'

export default class departmentController {
  static async getDepartment(req, res) { 
    try {
      const { rows } = await execute(
        `SELECT * FROM departments  ORDER BY created_at ASC`,
        []
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

  static async createDepartment(req, res) {
    const { name_tk, name_en,name_ru, faculties_id } = req.body;
    try {
      const result = await execute(
        `INSERT INTO departments (name_tk, name_en,name_ru, faculties_id) VALUES ($1,$2,$3,$4)`,
        [name_tk, name_en,name_ru, faculties_id]
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

  static async getOneDepartment(req, res) {
    const id = req.params.id
    try {
      const { rows } = await execute(
        `SELECT * FROM departments WHERE id = $1`,[id]
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

  static async updateDepartment(req, res) {
    const { name_tk, name_en,name_ru, faculties_id } = req.body;
    const id = parseInt(req.params.id);

    console.log(req.body)
    try {
      const result = await execute(
        `UPDATE departments SET name_tk = $1, name_en = $2, name_ru = $3, faculties_id = $4 WHERE id = $5`,
         [name_tk, name_en,name_ru, faculties_id, id]
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

  static async deleteDepartment(req, res) {
    const id = req.params.id;    
    try {
      const result = await execute(
        `DELETE FROM departments WHERE id =$1`,[id]
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

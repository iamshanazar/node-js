import {execute} from '../../../database/db.js'

import bcrypt from 'bcrypt'

export default class teachersController {
  static async getTeachers(req, res) { 

    try {
      const { rows } = await execute(
        `SELECT * FROM teachers  ORDER BY created_at ASC`,
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

  static async createTeachers(req, res) {

    const {firstname, lastname, name, password,  department_id } = req.body;
    const pass =  await bcrypt.hash(password, 10)
    try {
      const result = await execute(
        `INSERT INTO teachers (firstname, lastname, department_id) VALUES ($1,$2,$3 )`,
        [firstname, lastname, department_id]
      );
      const rows = await execute(
        `INSERT INTO users (name, password, type) VALUES ($1, $2, 'user')`,
        [name, pass]
      )
      if (result && rows) {
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

  static async getOneTeachers(req, res) {
    const id = req.params.id
    try {
      const { rows } = await execute(
        `SELECT * FROM teacheres WHERE id = $1`,[id]
      );
      if (rows) {
        res.send({
          faculties: rows[0],
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

  static async updateTeachers(req, res) {
    const {firstname, lastname, name, password, department_id } = req.body;

    const id = parseInt(req.params.id);
    let pass = null 
    if (password) {
     return  pass = bcrypt.hash(password,10)
    }

    try {
      const result = await execute(
        `UPDATE teachers SET firstname= $1, lastname = $2, name = $3, password = ${pass}, department_id = $4  WHERE id = $5`,
         [firstname,lastname,name,pass,department_id, id]
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

  static async deleteTeachers(req, res) {
    const id = req.params.id; 
    try {
      const result = await execute(
        `DELETE FROM teachers WHERE id =$1`,[id]
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

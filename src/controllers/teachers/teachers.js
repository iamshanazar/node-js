import { execute } from '../../../database/db.js';
import bcrypt from 'bcrypt';

export default class teachersController {
  // Get all teachers or filter by department_id
  static async getTeachers(req, res) {
    const { department_id: id, limit = 10, page = 1 } = req.query;
  
    const offset = (page - 1) * limit;
  
    try {
      // Query for teachers
      const query = id
        ? `SELECT * FROM teachers t INNER JOIN departments d ON t.department_id = d.id WHERE t.department_id = $1 LIMIT $2 OFFSET $3`
        : `SELECT * FROM teachers LIMIT $1 OFFSET $2`;
  
      const params = id ? [id, limit, offset] : [limit, offset];
  
      const { rows } = await execute(query, params);
  
      // Query for total count
      const countQuery = id
        ? `SELECT COUNT(*) FROM teachers t INNER JOIN departments d ON t.department_id = d.id WHERE t.department_id = $1`
        : `SELECT COUNT(*) FROM teachers`;
  
      const countParams = id ? [id] : [];
      const countResult = await execute(countQuery, countParams);
  
      const total = parseInt(countResult.rows[0].count, 10); // Total count of teachers
  
      if (rows.length > 0) {
        return res.status(200).json({
          data: rows,
          total, // Total count of teachers
          status: true,
        });
      } else {
        return res.status(404).json({
          message: 'No teachers found.',
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
  

  // Create a new teacher and user
  static async createTeachers(req, res) {
    const { firstname, lastname, name, password, department_id, sirname, job } = req.body;

    if (!firstname || !lastname || !name || !password || !department_id || !sirname || !job) {
      return res.status(400).json({
        message: 'All fields are required.',
        status: false,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await execute(
        `INSERT INTO teachers (firstname, lastname, department_id, sirname, job) VALUES ($1, $2, $3, $4, $5)`,
        [firstname, lastname, department_id, sirname, job]
      );

      await execute(
        `INSERT INTO users (name, password, type) VALUES ($1, $2, 'user')`,
        [name, hashedPassword]
      );

      return res.status(201).json({
        status: true,
        message: 'Teacher successfully created!',
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        status: false,
      });
    }
  }

  // Get a single teacher by ID
  static async getOneTeachers(req, res) {
    const { id } = req.params;

    try {
      const { rows } = await execute(`SELECT * FROM teachers WHERE id = $1`, [id]);

      if (rows.length > 0) {
        return res.status(200).json({
          data: rows[0],
          status: true,
        });
      } else {
        return res.status(404).json({
          message: 'Teacher not found.',
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

  // Update teacher information
  static async updateTeachers(req, res) {
    const { firstname, lastname, name, password, department_id, sirname, job } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Teacher ID is required.',
        status: false,
      });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    try {
      const query = `UPDATE teachers SET 
        firstname = $1, 
        lastname = $2, 
        name = $3, 
        password = COALESCE($4, password), 
        department_id = $5, 
        sirname = $6, 
        job = $7 
        WHERE id = $8`;

      const params = [
        firstname,
        lastname,
        name,
        hashedPassword,
        department_id,
        sirname,
        job,
        id,
      ];

      const result = await execute(query, params);

      if (result.rowCount > 0) {
        return res.status(200).json({
          message: 'Teacher successfully updated.',
          status: true,
        });
      } else {
        return res.status(404).json({
          message: 'Teacher not found.',
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

  // Delete a teacher
  static async deleteTeachers(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Teacher ID is required.',
        status: false,
      });
    }

    try {
      const result = await execute(`DELETE FROM teachers WHERE id = $1`, [id]);

      if (result.rowCount > 0) {
        return res.status(200).json({
          message: `Teacher with ID ${id} has been successfully deleted.`,
          status: true,
        });
      } else {
        return res.status(404).json({
          message: 'Teacher not found.',
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
}

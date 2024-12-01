import { execute } from '../../../database/db.js';

export default class ZurnalController {
  /**
   * Fetch all zurnal entries or filter by pagination
   */
  static async getZurnals(req, res) {
    const { limit = 10, page = 1 } = req.query;

    const offset = (page - 1) * limit;

    try {
      // Query to get paginated zurnal entries
      const query = `SELECT * FROM zurnal LIMIT $1 OFFSET $2`;
      const { rows } = await execute(query, [limit, offset]);

      // Query to get the total count for pagination
      const countQuery = `SELECT COUNT(*) FROM zurnal`;
      const countResult = await execute(countQuery);
      const total = parseInt(countResult.rows[0].count, 10);

      if (rows.length > 0) {
        return res.status(200).json({
          data: rows,
          total,
          status: true,
        });
      } else {
        return res.status(404).json({
          message: 'No zurnal entries found.',
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

  /**
   * Fetch a single zurnal entry by ID
   */
  static async getOneZurnal(req, res) {
    const { id } = req.params;

    try {
      const query = `SELECT * FROM zurnal WHERE id = $1`;
      const { rows } = await execute(query, [id]);

      if (rows.length > 0) {
        return res.status(200).json({
          data: rows[0],
          status: true,
        });
      } else {
        return res.status(404).json({
          message: `Zurnal entry with ID ${id} not found.`,
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

  /**
   * Create a new zurnal entry
   */
  static async createZurnal(req, res) {
    const { name_en, name_ru, name_tk } = req.body;

    if (!name_en || !name_ru || !name_tk) {
      return res.status(400).json({
        message: 'All fields (name_en, name_ru, name_tk) are required.',
        status: false,
      });
    }

    try {
      const query = `INSERT INTO zurnal (name_en, name_ru, name_tk) VALUES ($1, $2, $3) RETURNING *`;
      const { rows } = await execute(query, [name_en, name_ru, name_tk]);

      return res.status(201).json({
        data: rows[0],
        message: 'Zurnal entry created successfully.',
        status: true,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        status: false,
      });
    }
  }

  /**
   * Update an existing zurnal entry by ID
   */
  static async updateZurnal(req, res) {
    const { id } = req.params;
    const { name_en, name_ru, name_tk } = req.body;

    try {
      const query = `UPDATE zurnal SET name_en = $1, name_ru = $2, name_tk = $3 WHERE id = $4 RETURNING *`;
      const { rows } = await execute(query, [name_en, name_ru, name_tk, id]);

      if (rows.length > 0) {
        return res.status(200).json({
          data: rows[0],
          message: 'Zurnal entry updated successfully.',
          status: true,
        });
      } else {
        return res.status(404).json({
          message: `Zurnal entry with ID ${id} not found.`,
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

  /**
   * Delete a zurnal entry by ID
   */
  static async deleteZurnal(req, res) {
    const { id } = req.params;

    try {
      const query = `DELETE FROM zurnal WHERE id = $1 RETURNING id`;
      const { rows } = await execute(query, [id]);

      if (rows.length > 0) {
        return res.status(200).json({
          message: `Zurnal entry with ID ${id} deleted successfully.`,
          status: true,
        });
      } else {
        return res.status(404).json({
          message: `Zurnal entry with ID ${id} not found.`,
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

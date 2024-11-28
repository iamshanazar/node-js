import { execute } from "../../../database/db.js";
import upload from "../../../function/upload.js";
export default class ArticleController {
  static async getArticle(req, res) {
    try {
        const { author, type } = req.query;

        // Base SQL query
        let query = `
            SELECT id, name_tk, name_en, name_ru, author,type, file_name, file_size, created_at 
            FROM articles 
        `;

        // Conditions array for WHERE clause
        const conditions = [];
        const values = [];

        // Add conditions dynamically based on query parameters
        if (author) {
            conditions.push(`author = $${conditions.length + 1}`);
            values.push(author);
        }

        if (type) {
            conditions.push(`type = $${conditions.length + 1}`);
            values.push(type);
        }

        // Append WHERE clause if there are conditions
        if (conditions.length > 0) {
            query += `WHERE ${conditions.join(' AND ')} `;
        }

        // Add ORDER BY clause
        query += `ORDER BY created_at DESC`;

        // Execute the query with the dynamically built values
        const { rows } = await execute(query, values);

        if (rows) {
            // Map rows to include the file URL and convert file size to MB
            const data = rows.map((row) => ({
                ...row,
                file_size: row.file_size
                    ? (row.file_size / (1024 * 1024)).toFixed(2) // Convert to MB
                    : null,
                file_url: row.file_name
                    ? `${req.protocol}://${req.get('host')}/uploads/${row.file_name}`
                    : null,
            }));

            return res.send({
                data,
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
      // Use multer to handle file uploads
      upload.single('file')(req, res, async (err) => {
          if (err) {
              return res.status(400).json({
                  message: err.message,
                  status: false,
              });
          }
  
          const { name_tk, name_en, name_ru, author, type } = req.body;
          const file = req.file;
  
          console.log(req.body, 'body', file,'file')
  
          if (!name_tk || !name_en || !name_ru) {
              return res.status(400).json({
                  message: "All fields are required",
                  status: false,
              });
          }
  
          if (!file) {
              return res.status(400).json({
                  message: "File is required",
                  status: false,
              });
          }
  
          try {
              // Insert article and file information into the database
              const result = await execute(
                  `INSERT INTO articles (name_tk, name_en, name_ru, author,type, file_name, file_size) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                  [name_tk, name_en, name_ru, author, type, file.filename, file.size]
              );
  
              return res.status(201).json({
                  status: true,
                  message: "Article successfully created!",
                  data: result.rows[0],
              });
          } catch (err) {
              return res.status(500).json({
                  message: err.message || "An unexpected error occurred",
                  status: false,
              });
          }
      });
  }
    static async getOneArticles(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid ID",
                status: false,
            });
        }

        try {
            const { rows } = await execute(
                `SELECT * FROM articles WHERE id = $1`,
                [id]
            );

            if (rows.length > 0) {
                return res.send({
                    data: rows[0],
                    status: true,
                });
            } else {
                return res.status(404).json({
                    message: "Article not found",
                    status: false,
                });
            }
        } catch (err) {
            return res.status(500).json({
                message: err.message || "An unexpected error occurred",
                status: false,
            });
        }
    }

    static async updateArticles(req, res) {
        const { name_tk, name_en, name_ru, author, type } = req.body;
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid ID",
                status: false,
            });
        }

        if (!name_tk || !name_en || !name_ru) {
            return res.status(400).json({
                message: "All fields are required",
                status: false,
            });
        }

        try {
            const { rows } = await execute(
                `UPDATE articles SET name_tk = $1, name_en = $2, name_ru = $3, type = $4, author = $5 WHERE id = $6 RETURNING *`,
                [name_tk, name_en, name_ru, author, type, id]
            );

            if (rows.length > 0) {
                return res.send({
                    data: rows[0],
                    status: true,
                });
            } else {
                return res.status(404).json({
                    message: "Article not found",
                    status: false,
                });
            }
        } catch (err) {
            return res.status(500).json({
                message: err.message || "An unexpected error occurred",
                status: false,
            });
        }
    }

    static async deleteArticles(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid ID",
                status: false,
            });
        }

        try {
            const { rowCount } = await execute(
                `DELETE FROM articles WHERE id = $1`,
                [id]
            );

            if (rowCount > 0) {
                return res.status(200).send({
                    message: `Article with ID ${id} has been successfully deleted`,
                    status: true,
                });
            } else {
                return res.status(404).json({
                    message: "Article not found",
                    status: false,
                });
            }
        } catch (err) {
            return res.status(500).json({
                message: err.message || "An unexpected error occurred",
                status: false,
            });
        }
    }
}

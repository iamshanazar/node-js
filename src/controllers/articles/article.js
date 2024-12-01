import { execute } from "../../../database/db.js";
import upload from "../../../function/upload.js";
export default class ArticleController {
    static async getArticles(req, res) {
        const { limit = 10, page = 1, zurnal_id, search } = req.query;
        const offset = (page - 1) * limit;
    
        let query = `SELECT id, name_tk, name_en, name_ru, created_at, zurnal_id, teacher_id, type, file_name, file_size
                     FROM articles WHERE 1=1`;
        let params = [];
    
        if (search) {
            query += ` AND (name_tk ILIKE $${params.length + 1} OR name_en ILIKE $${params.length + 2} OR name_ru ILIKE $${params.length + 3})`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
    
        if (zurnal_id) {
            query += ` AND zurnal_id = $${params.length + 1}`;
            params.push(zurnal_id);
        }
    
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
    
        try {
            const { rows } = await execute(query, params);
    
            if (rows.length > 0) {
                const baseUrl = 'http://213.130.144.154/uploads'; // Ensure this is the correct base URL for your app
    
                // Add file URL to each article
                rows.forEach(article => {
                    article.file_url = `${baseUrl}/${article.file_name}`; // Correct the URL generation
                });
    
                return res.status(200).json({
                    status: true,
                    data: rows,
                });
            } else {
                return res.status(404).json({
                    message: "No articles found.",
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
    
    
    
    


    static async createArticle(req, res) {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                    status: false,
                });
            }

            const { name_tk, name_en, name_ru, type, zurnal_id, teacher_id } = req.body;
            const file = req.file;

            if (!name_tk || !name_en || !name_ru || !zurnal_id) {
                return res.status(400).json({
                    message: "All fields (name_tk, name_en, name_ru, zurnal_id, type) are required",
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
                const result = await execute(
                    `INSERT INTO articles (name_tk, name_en, name_ru, type, zurnal_id, teacher_id, file_name, file_size) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                    [
                        name_tk,
                        name_en,
                        name_ru,
                        type,
                        zurnal_id,
                        teacher_id || null,
                        file.filename,
                        file.size,
                    ]
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

      // Get Single Article
    static async getArticleById(req, res) {
        const { id } = req.params;

        try {
            const result = await execute(`SELECT * FROM articles WHERE id = $1`, [id]);

            if (result.rows.length > 0) {
                return res.status(200).json({
                    status: true,
                    data: result.rows[0],
                });
            } else {
                return res.status(404).json({
                    message: "Article not found.",
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

    // Update Article
    static async updateArticle(req, res) {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                    status: false,
                });
            }

            const { id } = req.params;
            const { name_tk, name_en, name_ru, author, type, zurnal_id, teacher_id } = req.body;
            const file = req.file;

            try {
                const article = await execute(`SELECT * FROM articles WHERE id = $1`, [id]);
                if (article.rows.length === 0) {
                    return res.status(404).json({
                        message: "Article not found.",
                        status: false,
                    });
                }

                const query = `
                    UPDATE articles 
                    SET name_tk = $1, name_en = $2, name_ru = $3, author = $4, type = $5, zurnal_id = $6, 
                        teacher_id = $7, file_name = $8, file_size = $9
                    WHERE id = $10 RETURNING *`;
                const params = [
                    name_tk || article.rows[0].name_tk,
                    name_en || article.rows[0].name_en,
                    name_ru || article.rows[0].name_ru,
                    author || article.rows[0].author,
                    type || article.rows[0].type,
                    zurnal_id || article.rows[0].zurnal_id,
                    teacher_id || article.rows[0].teacher_id,
                    file ? file.filename : article.rows[0].file_name,
                    file ? file.size : article.rows[0].file_size,
                    id,
                ];

                const result = await execute(query, params);

                return res.status(200).json({
                    status: true,
                    message: "Article successfully updated!",
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

    // Delete Article
    static async deleteArticle(req, res) {
        const { id } = req.params;

        try {
            const result = await execute(`DELETE FROM articles WHERE id = $1 RETURNING *`, [id]);

            if (result.rows.length > 0) {
                return res.status(200).json({
                    status: true,
                    message: "Article successfully deleted!",
                });
            } else {
                return res.status(404).json({
                    message: "Article not found.",
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



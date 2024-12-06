import { execute } from "../../../database/db.js";
import upload from "../../../function/upload.js";
export default class ArticleController {
    static async getArticles(req, res) {
        const limit = parseInt(req.query.limit, 10) || 10;
        const page = parseInt(req.query.page, 10) || 1;
        const offset = (page - 1) * limit;
    
        if (limit <= 0 || page <= 0) {
            return res.status(400).json({
                status: false,
                message: "Limit and page must be positive integers.",
            });
        }
    
        let query = `SELECT id, name_tk, name_en, name_ru, created_at, zurnal_id, teacher_id, type, file_name, file_size
                     FROM articles WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) AS total FROM articles WHERE 1=1`;
        let params = [];
    
        if (req.query.search) {
            query += ` AND (name_tk ILIKE $${params.length + 1} OR name_en ILIKE $${params.length + 2} OR name_ru ILIKE $${params.length + 3})`;
            countQuery += ` AND (name_tk ILIKE $${params.length + 1} OR name_en ILIKE $${params.length + 2} OR name_ru ILIKE $${params.length + 3})`;
            params.push(`%${req.query.search}%`, `%${req.query.search}%`, `%${req.query.search}%`);
        }
    
        if (req.query.zurnal_id) {
            query += ` AND zurnal_id = $${params.length + 1}`;
            countQuery += ` AND zurnal_id = $${params.length + 1}`;
            params.push(req.query.zurnal_id);
        }
    
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
    
        try {
            const { rows } = await execute(query, params);
            const { rows: countResult } = await execute(countQuery, params.slice(0, -2));
            const total = countResult[0]?.total || 0;
            const totalPages = Math.ceil(total / limit);
    
            rows.forEach(article => {
                const baseUrl = 'http://213.130.144.154/uploads';
                article.file_url = `${baseUrl}/${article.file_name}`;
                article.file_size = (article.file_size / (1024 * 1024)).toFixed(2);
            });
    
            return res.status(200).json({
                status: true,
                data: rows,
                    total,
                    totalPages,
                    currentPage: page,
                    hasNextPage: page < totalPages,
            });
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
       console.log(id,'id')
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
            const { name_tk, name_en, name_ru, type, zurnal_id, teacher_id } = req.body;
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
                    SET name_tk = $1, name_en = $2, name_ru = $3, type = $4, zurnal_id = $5, 
                        teacher_id = $6, file_name = $7, file_size = $8
                    WHERE id = $9 RETURNING *`;
                const params = [
                    name_tk || article.rows[0].name_tk,
                    name_en || article.rows[0].name_en,
                    name_ru || article.rows[0].name_ru,
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



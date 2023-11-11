import pg from 'pg'
import {env} from '../config/config.js'
const pool = new pg.Pool({
  host: env.db_host,
  port: env.db_port,
  database: env.db_database,
  user: env.db_user,
  password: env.db_password,
})

export async function execute(query, params) {
  try {
    return await pool.query(query, params)
  } catch (error) {
    console.log(error)
  }
}

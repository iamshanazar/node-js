import { createApp } from './src/app.js'
import { env } from './config/config.js'

createApp().listen(+env.port, env.host, () => console.log(`Listen on ${env.db_host}:${env.port}`))

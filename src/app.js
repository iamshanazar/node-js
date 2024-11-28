import express from 'express'
import bodyParser from 'body-parser'
import { prompt } from './utils/logging.js'
import { allRouter } from './routers/index.js'
import cors from 'cors'
import path from 'path'
import fs from 'fs';

export function createApp() {
  const app = express()

  app.use(function (_, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, accept, access-control-allow-origin')
    next()
  })

  app.use(express.json())
  app.use(cors())
  app.use(prompt)
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/api', allRouter)

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

  // example render for front's hmtl
  // app.get('*', (_, res) => {
  //   res.sendFile()
  // })
  return app
}

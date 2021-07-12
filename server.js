const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { createDbInstance, DbRep } = require('./src/api/database')
const { createServer } = require('http')
const dotenv = require('dotenv')
const express = require('express')
const { join } = require('path')
const moment = require('moment') 
const Router = require('./src/api/routes')

const app = express()
const server = createServer(app)

// .env
dotenv.load()

// Dependencies
const port = parseInt(process.env.PORT) || 8080
//const database = createDbInstance(process.env.DB_URL)
//const dbRep = DbRep({ database })
//const router = Router({ dbRep })
const router = Router()

// Parsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// Routes
app.use('/api/', router)

// Server startup
server.listen(port, () => {
  console.log(`[server] started at ${moment()}`)
  console.log(`[server] listening on port ${port}`)
})

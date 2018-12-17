const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL

const logger = require('./logger.js')

app.use(bodyParser.json())

app.get('/data', (req, res) => res.send('hi thar'))
app.post('/data', (req, res) => {
    logger.log(req.body)
    res.send(req.body)
})

console.log(connectionString)

const pool = new Pool()

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    pool.end()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
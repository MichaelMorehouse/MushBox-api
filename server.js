const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL

const logger = require('./logger.js')

app.use(bodyParser.json())

app.get('/data', (req, res) => res.send('hi thar'))

app.get('/create', (req, res) => {
    createTable(req, res);
    res.send('tables boss');
})

app.post('/data', (req, res) => {
    logger.log(req.body)
    res.send(req.body)
})

const pool = new Pool({
    connectionString: connectionString,
})

const createTableText = () => `
CREATE TEMP TABLE dates(
  date_col DATE,
  timestamp_col TIMESTAMP,
  timestamptz_col TIMESTAMPTZ,
);
`

const createTable = async (req, res) => {
    const client = await pool.connect()
    console.log("trying boss")
    try {
      await client.query(createTableText)
      console.log("we did it boss")
    } 
    catch (err) {
        console.log(err.stack)
    } 
    finally {
      client.release()
    }
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
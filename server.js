const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL

const logger = require('./logger.js')

app.use(bodyParser.json())

app.get('/data', (req, res) => res.send('hi boss'))

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

(async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect()
  
    try {
      await client.query('BEGIN')
      console.log("trying boss")
      await client.query(createTableText)
      await client.query('COMMIT')
      
    } catch (e) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
    console.log("we did it boss")
})().catch(err => console.error(err.stack))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
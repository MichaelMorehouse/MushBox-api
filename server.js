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
    const client = await pool.connect()
    try {
      await client.query(createTableText)
      console.log("we did it boss")
    } finally {
      client.release()
    }
  })().catch(e => console.log(e.stack))

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
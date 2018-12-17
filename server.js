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
  
pool.connect((err, client, done) => {

    const shouldAbort = (err) => {
      if (err) {
        console.error('Error in transaction', err.stack)
        client.query('ROLLBACK', (err) => {
          if (err) {
            console.error('Error rolling back client', err.stack)
          }
          // release the client back to the pool
          done()
        })
      }
      return !!err
    }

    const createTableText = `
        CREATE TEMP TABLE dates(
        date_col DATE,
        timestamp_col TIMESTAMP,
        timestamptz_col TIMESTAMPTZ,
    );
    `
    // create our temp table
    client.query(createTableText, (err) => {
        if (shouldAbort(err)) return
    })

    // insert the current time into it
    const now = new Date()
    const insertText = 'INSERT INTO dates(date_col, timestamp_col, timestamtz_col'
    client.query(insertText, [now, now, now], (err) => {
        if (shouldAbort(err)) return
    })

    // read the row back out
    const result = client.query('SELECT * FROM dates', err => {
        if (shouldAbort(err)) return
    })

    console.log(result.rows)
    done()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
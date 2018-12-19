const Router = require('express-promise-router')

const db = require('../db')

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()

const createTableText = `
CREATE TABLE IF NOT EXISTS dhtlog(
    timestamptz TIMESTAMPTZ,
    temperature REAL,
    humidity REAL,
    PRIMARY KEY(timestamptz)
);
`

router.get('/create', async (req, res) => {
    const response = await db.query(createTableText)
    res.send(response)
})

router.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM dhtlog ORDER BY timestamptz DESC LIMIT 100')
  res.send(rows)
})

router.post('/', async (req, res) => {
    const { temperature, humidity } = req.body;

    const timestamp = new Date();
    const insertText = `
        INSERT INTO dhtlog(timestamptz, temperature, humidity)
        VALUES ($1, $2, $3);
    `
    const response = await db.query(insertText, [timestamp, temperature, humidity])
    res.send(response)
})

// export our router to be mounted by the parent application
module.exports = router
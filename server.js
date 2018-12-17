const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

const logger = require('./logger.js')

app.use(bodyParser.json())

app.get('/data', (req, res) => res.send('hi thar'))
app.post('/data', (req, res) => {
    logger.log(req.body)
    res.send(req.body)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
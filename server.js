const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const mountRoutes = require('./routes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
mountRoutes(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
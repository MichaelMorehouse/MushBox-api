const dhtlog = require('./dhtlog')

module.exports = (app) => {
  app.use('/log', dhtlog)
}
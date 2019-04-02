const knex = require('knex')({
  // debug: process.env.NODE_ENV === 'development',
  client: 'mysql',
  connection: process.env.DB_CONNECTION
})

module.exports = knex

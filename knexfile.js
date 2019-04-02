const env = require('./server/environment')
for (const key in env) {
  process.env[key] = env[key]
}

module.exports = {
  client: 'mysql',
  connection: process.env.DB_CONNECTION || { user: 'me', database: 'my_app' }
}

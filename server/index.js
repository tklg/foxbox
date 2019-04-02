const BoxServer = require('./src')
const env = require('./environment')
for (const key in env) {
  process.env[key] = env[key]
}

const server = new BoxServer()
server.raise()

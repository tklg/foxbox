const BoxServer = require('./src')
const env = require('../environment')
const pack = require('../package')

const combined = { ...pack, ...env }
for (const key in combined) {
  process.env[key] = combined[key]
}

const server = new BoxServer()
server.raise()

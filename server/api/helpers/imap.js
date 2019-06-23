const ImapClient = require('emailjs-imap-client').default

const providerOpts = {
  'google': {
    host: 'imap.gmail.com',
    port: 993,
    opts: {
      enableCompression: true
    }
  }
}

const clientBuilder = async ({ host, port, ...opts }) => {
  const c = new ImapClient(host, port, {
    id: {
      name: process.env.name,
      version: process.env.version
    },
    ...opts
  })
  await c.connect()
  return c
}

const close = (client) => client.close()

module.exports = {
  providerOpts,
  clientBuilder,
  close
}

const ImapClient = require('emailjs-imap-client').default
const MailParser = require('mailparser-mit').MailParser
const ReadableStream = require('stream').Readable
const TAG = 'helper.imap'

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

async function parseMime (mime) {
  return new Promise((resolve, reject) => {
    const parser = new MailParser()
    const stream = new ReadableStream()
    stream._read = () => {}
    stream.push(mime)
    stream.push(null)
    parser.on('end', mail => {
      resolve(mail)
    })
    stream.pipe(parser)
  })
}

module.exports = {
  providerOpts,
  clientBuilder,
  close,
  parseMime
}

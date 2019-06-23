const Hashids = require('hashids')
const hashids = new Hashids(process.env.HASH_SALT || 'salty', 8)

const hash = (...ids) => hashids.encode(...ids)

const unhash = (hash) => hashids.decode(hash)

module.exports = {
  hash,
  unhash
}

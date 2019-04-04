/* global boxes */
module.exports = {
  user: {
    references: 'user'
  },
  token: 'string',
  expiresAt: 'number',
  expired: {
    type: 'boolean',
    default: false
  },

  beforeCreate: async (token) => {
    const { generateToken } = await boxes.helpers.crypto()
    const now = +(Date.now() / 1000).toFixed(0)
    token.expires_at = now + (60 * 1000 * 24 * 7)
    token.token = await generateToken({ bytes: 48 })
  }
}

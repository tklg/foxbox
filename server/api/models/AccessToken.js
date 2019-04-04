/* global Log boxes RefreshToken */
const TAG = 'AccessToken'

module.exports = {
  user: {
    references: 'user'
  },
  token: 'string',
  refreshToken: {
    references: 'refreshToken'
  },
  expiresAt: 'number',
  expired: {
    type: 'boolean',
    default: false
  },

  beforeCreate: async (token) => {
    const { jwtSign } = await boxes.helpers.crypto()

    const now = +(Date.now() / 1000).toFixed(0)
    const refreshToken = await RefreshToken.create({ user: token.user }) // 1 week
    token.expires_at = now + 60000

    const jwtToken = await jwtSign({
      'sub': token.user,
      'exp': now + 60000, // 1 hour
      'iat': now,
      'token_type': 'bearer'
    })
    token.refresh_token = refreshToken.id
    token.token = jwtToken
  },
  beforeUpdate: async (token) => {

  }
}

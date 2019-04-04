/* global boxes User */
module.exports = async (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      const { jwtVerify } = await boxes.helpers.crypto()
      const header = req.headers.authorization.substr(7)
      const data = await jwtVerify(header)
      const user = await User.findOne({ id: data.sub })
      // req.user = user
      req.login(user, () => {
        next()
      })
    } else {
      throw new Error('missing authorization header')
    }
  } catch (e) {
    if (req.xhr) {
      res.json({
        error: e.message
      })
    } else {
      res.redirect('/')
    }
  }
}

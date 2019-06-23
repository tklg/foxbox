module.exports = async (req, res, next) => {
  if (req.user) {
    return next()
  } else {
    Log.d('sessionAuth', 'not logged in')
    res.redirect('/')
  }
}

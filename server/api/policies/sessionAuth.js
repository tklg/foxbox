module.exports = (req, res, next) => {
  if (req.session.authenticated) return next()
  res.redirect('/')
}

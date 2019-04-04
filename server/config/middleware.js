const express = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
}

const notFoundMiddleware = (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
}

module.exports = {
  crossDomain: allowCrossDomain,
  cookie: cookieParser('foobarbaz'),
  urlencoded: bodyParser.urlencoded({ extended: true }),
  json: bodyParser.json(),
  session: session({
    secret: 'foobarbaz',
    resave: false,
    saveUninitialized: true
  }),
  passportInit: passport.initialize(),
  passport: passport.session(),

  routed: [
    {
      route: '/',
      fn: express.static(path.join(__dirname, '..', '/public'))
    }, {
      route: '*',
      fn: notFoundMiddleware
    }
  ]
}

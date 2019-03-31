const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
}

const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    status: 404,
    error: `The resource '${req.originalUrl}' could not be found.`
  })
}

module.exports = {
  urlencoded: bodyParser.urlencoded({ extended: true }),
  json: bodyParser.json(),
  crossDomain: allowCrossDomain,

  routed: [
    {
      route: '/',
      middleware: express.static(path.join(__dirname, '..', '/public'))
    }, {
      route: '*',
      middleware: notFoundMiddleware
    }
  ]
}

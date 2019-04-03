/* global Log */
global.Log = require('./Log')
const path = require('path')
const fs = require('fs')
const TAG = 'server'
const sourcePath = p => path.join('../', p)

const routes = require(sourcePath('config/routes'))
const middleware = require(sourcePath('config/middleware'))
const express = require('express')
const PORT = process.env.PORT || 3001

process.on('unhandledRejection', (e, p) => {
  Log.e(TAG, 'Unhandled Rejection at: Promise', p)
  Log.e(TAG, e)
})

const debugMiddleware = (v, p) => (re, rq, n) => {
  Log.d(TAG, `Handling ${v.toUpperCase()} ${p}`)
  n()
}

module.exports = class BoxServer {
  async raise () {
    const loadModels = require('./Models')
    const app = express()
    const server = require('http').Server(app)
    this.server = server
    this.app = app
    this.controllers = {}

    await this.loadControllers()
    await this.loadMiddleware()

    await loadModels()

    server.listen(PORT, () => {
      Log.d(TAG, `Express running on :${PORT}`)
    })
  }
  async loadRoutes () {
    for (const route in routes) {
      const verb = route.split(' ')[0].toLowerCase()
      const pth = route.substr(verb.length + 1)
      const str = routes[route]
      if (typeof str === 'string') {
        const controller = str.split('#')[0]
        const action = str.split('#')[1]
        if (this.controllers[controller]) {
          if (this.controllers[controller][action]) {
            this.app[verb](pth, debugMiddleware(verb, pth), this.controllers[controller][action])
          } else {
            Log.e(TAG, `could not find action: ${str}`)
          }
        } else {
          Log.e(TAG, 'could not find controller: ' + controller)
        }
      }
    }
  }
  loadControllers () {
    let self = this
    return new Promise((resolve, reject) => {
      fs.readdir(path.resolve(path.join(__dirname, sourcePath('api/controllers'))), async (err, files) => {
        if (err) throw err
        for (const file of files) {
          try {
            const name = file.replace('Controller', '').replace('.js', '')
            self.controllers[name] = require(sourcePath(`api/controllers/${file}`))
            Log.d(TAG, `registered controller: ${name}`)
          } catch (e) {
            Log.e(TAG, e)
            reject(e)
          }
        }
        resolve()
      })
    })
  }
  async loadMiddleware () {
    // Log.d(TAG, middleware)
    const { routed, ...rest } = middleware

    for (const item in rest) {
      this.app.use(rest[item])
    }

    await this.loadRoutes()

    for (const item of routed) {
      this.app.use(item.route, item.fn)
    }
  }
}

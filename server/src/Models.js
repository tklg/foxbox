const path = require('path')
const fs = require('fs')
const Log = require('./Log')
const TAG = 'models'
const knex = require('./Database')

const sourcePath = p => path.join('../', p)

function loadModels () {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(path.join(__dirname, sourcePath('api/models'))), async (err, files) => {
      if (err) throw err
      for (const file of files) {
        try {
          const name = file.replace('.js', '')
          if (global[name]) throw new Error('global namespace conflict: ' + name)
          const desc = require(sourcePath(`api/models/${file}`))
          const model = bindModel(name, desc)
          global[name] = model
          Log.d(TAG, `registered model: ${name}`)
        } catch (e) {
          Log.e(TAG, e)
          reject(e)
        }
      }
      resolve()
    })
  })
}

class MDL {}

function bindModel (name, desc) {
  const obj = Model.build()
  const __table = name.toLowerCase()

  function clean (params) {
    for (const i in params) {
      const attr = obj.attributes[i]
      if (params[i] instanceof MDL) {
        if (attr.references !== params[i].__table) throw new Error(`The attribute "${name}" on ${obj.name} must be of type ${params[i].__table}.`)
        params[i] = params[i].id
      }
    }
    return params
  }

  class Model extends MDL {
    static build () {
      const { ...attrs } = desc
      const obj = {
        name,
        attributes: {
          ...attrs,
          id: {
            type: 'integer',
            readOnly: true,
            index: true,
            primary: true
          },
          createdAt: 'number',
          updatedAt: 'number'
        }
      }
      return obj
    }
    constructor () {
      super()
      this.id = -1
      this.__table = __table
      this.__dirty = {}
      for (const attr in obj.attributes) {
        this[attr] = null
        this.__dirty[attr] = false
      }

      return new Proxy(this, {
        get (target, name, receiver) {
          if (typeof name !== 'symbol') {
            // const attr = obj.attributes[name]
            // if (!attr) throw new Error(`get: There is no attribute "${name}" on ${obj.name}.`)
          }
          return Reflect.get(target, name, receiver)
        },
        set (target, name, value, receiver) {
          if (typeof name !== 'symbol') {
            const attr = obj.attributes[name]
            // if (!attr) throw new Error(`There is no attribute "${name}" on ${obj.name}.`)
            if (attr.readOnly) throw new Error(`The attribute ${name} on ${obj.name} is read only.`)
            if (typeof attr === 'string' && !(value instanceof MDL)) {
              if (!validType(value, attr)) throw new Error(`The attribute "${name}" on ${obj.name} must be of type ${attr}.`)
            } else {
              if (value instanceof MDL) {
                if (attr.references !== value.__table) throw new Error(`The attribute "${name}" on ${obj.name} must be of type ${value.__table}.`)
                value = value.id
                attr.type = attr.references
              }
              if (!validType(value, attr.type)) throw new Error(`The attribute "${name}" on ${obj.name} must be of type ${attr.type}.`)
            }
            target.__dirty[name] = true
          }
          return Reflect.set(target, name, value, receiver)
        }
      })
    }
    static knex () {
      return knex(__table)
    }
    static create (q) {
      q = clean(q)
      return knex(__table).insert(q)
    }
    static where (q) {
      q = clean(q)
      return knex(__table).where(q)
    }
    static findOne (q) {
      q = clean(q)
      return knex(__table).where(q).limit(1)
    }
    static findOrCreate (q) {
      q = clean(q)
      return knex.transaction(trx => {
        trx(__table).where(q).then(res => {
          if (res.length === 0) {
            return trx(__table).insert(q).then(() => {
              return trx(__table).where(q)
            })
          } else {
            return res
          }
        })
      })
    }
    static all () {
      return knex(__table).where({})
    }
    save () {
      const attrs = {}
      for (const attr in this.__dirty) {
        if (this.__dirty[attr]) {
          attrs[attr] = this[attr]
          this.__dirty[attr] = false
        }
      }
      knex(__table).where({ id: this.id }).update(attrs)
    }
    delete () {
      knex(__table).where({ id: this.id }).del()
    }
  }
  return Model
}

function validType (value, type) {
  switch (type) {
    case 'string': return typeof value === 'string'
    case 'boolean': return typeof value === 'boolean'
    case 'integer':
    case 'number': return Number.isInteger(value)
    case 'double':
    case 'float': return !Number.isNaN(value) && !Number.isInteger(value)
    case 'json': return typeof value === 'object'
  }
}

module.exports = loadModels

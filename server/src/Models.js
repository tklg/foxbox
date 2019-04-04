const path = require('path')
const fs = require('fs')
const Log = require('./Log')
const TAG = 'models'
const knex = require('./Database')

const sourcePath = p => path.join('../', p)

const capitalize = str => str[0].toUpperCase() + str.substr(1)
const titleize = str => str.split(/_/).map(s => capitalize(s)).join('')
const snakeize = str => str.replace(/([^\b])([A-Z])/g, '$1_$2').toLowerCase()
const camelize = str => {
  const s = titleize(str)
  return s[0].toLowerCase() + s.substr(1)
}

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

function bindModel (name, { beforeCreate, beforeUpdate, beforeDelete, ...desc }) {
  class Model extends MDL {
    static get __table () { return __table }
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
    constructor (vals) {
      super()
      this.id = -1
      this.__dirty = {}
      for (const attr in { ...obj.attributes, ...vals }) {
        this[attr] = vals[attr]
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
                if (snakeize(attr.references) !== Object.getPrototypeOf(value).constructor.__table) throw new Error(`The attribute "${name}" on ${obj.name} must be of type ${titleize(value.__table)}.`)
                value = value.id || value
                attr.type = snakeize(attr.references)
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
    static async create (q) {
      q = clean(q)
      if (beforeCreate) await beforeCreate(q)
      return knex.transaction(async trx => {
        const now = +(Date.now() / 1000).toFixed(0)
        await trx(__table).insert({ ...q, created_at: now, updated_at: now })
        const vals = await trx(__table).where(q).first()
        if (!vals) return null
        return new Model(camelizeAll(vals))
      })
    }
    static async where (q) {
      q = clean(q)
      const vals = await knex(__table).where(q)
      if (!vals.length) return []
      return vals.map(x => new Model(camelizeAll(x)))
    }
    static async findOne (q) {
      q = clean(q)
      const val = await knex(__table).where(q).first()
      if (!val) return null
      return new Model(camelizeAll(val))
    }
    static async findOrCreate (q) {
      q = clean(q)
      return knex.transaction(async trx => {
        const res = await trx(__table).where(q).first()
        if (!res) {
          const now = +(Date.now() / 1000).toFixed(0)
          if (beforeCreate) await beforeCreate(q)
          await trx(__table).insert({ ...q, created_at: now, updated_at: now })
          const x = await trx(__table).where(q).first()
          return new Model(camelizeAll(x))
        } else {
          return new Model(camelizeAll(res[0]))
        }
      })
    }
    static async all () {
      const vals = await knex(__table).where({})
      if (!vals.length) return []
      return vals.map(x => new Model(camelizeAll(x)))
    }
    async save () {
      const attrs = {}
      if (beforeUpdate) await beforeUpdate(this)
      this.updatedAt = +(Date.now() / 1000).toFixed(0)
      this.__dirty['updatedAt'] = true
      for (const attr in this.__dirty) {
        if (this.__dirty[attr]) {
          attrs[snakeize(attr)] = this[attr]
          this.__dirty[attr] = false
        }
      }
      delete attrs.__dirty
      return knex(__table).where({ id: this.id }).update(attrs)
    }
    update (q) {
      for (const key in q) {
        this[key] = q[key]
      }
      return this.save()
    }
    async delete () {
      if (beforeDelete) await beforeDelete(this)
      return knex(__table).where({ id: this.id }).del()
    }
  }

  const obj = Model.build()
  const __table = snakeize(name)

  function clean (params) {
    const pars = {}
    for (const i in params) {
      const attr = obj.attributes[i]
      if (params[i] instanceof MDL) {
        if (snakeize(attr.references) !== Object.getPrototypeOf(params[i]).constructor.__table) throw new Error(`The attribute "${name}" on ${obj.name} must be of type ${params[i].__table}.`)
        params[i] = params[i].id || params[i]
      }
      pars[snakeize(i)] = params[i]
    }
    delete pars.__dirty
    return pars
  }
  function camelizeAll (params) {
    const pars = {}
    for (const i in params) {
      pars[camelize(i)] = params[i]
    }
    return pars
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

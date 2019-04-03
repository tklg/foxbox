exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.string('email')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('user', t => {
      t.dropColumns('email')
    })
  ])
}

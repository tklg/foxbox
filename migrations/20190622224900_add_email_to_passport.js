exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('passport', t => {
      t.string('email')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('passport', t => {
      t.dropColumns('email')
    })
  ])
}

exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('message', t => {
      t.increments('id').primary()
      t.integer('user').unsigned().references('user.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.integer('provider').unsigned().references('passport.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.string('uid')
      t.text('plain')
      t.text('html')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('message')
  ])
}

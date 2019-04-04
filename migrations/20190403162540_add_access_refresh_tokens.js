exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('access_token', t => {
      t.increments('id').primary()
      t.integer('user').unsigned().references('user.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.string('token')
      t.integer('refresh_token').unsigned().references('refresh_token.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.boolean('expired')
      t.bigInteger('expires_at')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    }),
    knex.schema.createTable('refresh_token', t => {
      t.increments('id').primary()
      t.integer('user').unsigned().references('user.id').onDelete('CASCADE').onUpdate('CASCADE')
      t.string('token')
      t.boolean('expired')
      t.bigInteger('expires_at')
      t.bigInteger('created_at')
      t.bigInteger('updated_at')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('refresh_token'),
    knex.schema.dropTable('access_token')
  ])
}

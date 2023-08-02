import { knex, Knex } from 'knex'

let db_cache : Knex

export function getDB () {
  if (db_cache === undefined) {
    db_cache = knex({
      client: 'sqlite3',
      connection: { filename: "./db/db.sqlite" },
    })
  }
  return db_cache
}

async function init_tables(db : Knex) {
  await db.schema.hasTable('pass').then((exists) => {
    if (!exists) {
      return db.schema.createTable('pass', (table) => {
        table.increments('id').primary()
        table.string('invoice_id')
        table.json('invoice')
        table.integer('expires')
      })
    }
  })
}

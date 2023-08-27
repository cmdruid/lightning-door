import DB, { Database, Options, RunResult } from 'better-sqlite3'

import { z, ZodSchema } from 'zod'

type Obj = Record<string, string | number | boolean | null>

interface Schema {
  create : ZodSchema
  data   : ZodSchema
  query  : ZodSchema
  update : ZodSchema
}

const DB_OPTIONS : Options = {}

let db : Database

export function connect (
  path  : string,
  opt  ?: Options
) {
  if (db === undefined) {
    db = new DB(path, { ...DB_OPTIONS, ...opt })
    db.pragma('journal_mode = WAL')
  }
  return db
}

function init_table (
  db   : Database,
  name : string,
  sql  : string
) : RunResult {
  const exists = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='${name}';
  `).get()
  return db.prepare(`CREATE TABLE ${name} (${sql});`).run()
}

export class Controller {
  readonly _db     : Database
  readonly _name   : string
  readonly _sql    : string
  readonly _schema : Schema

  constructor (
    db     : Database,
    name   : string,
    sql    : string,
    schema : Schema
  ) {
    this._db     = db
    this._name   = name
    this._sql    = sql
    this._schema = schema
  }

  get db () : Database {
    return this._db
  }

  get name () : string {
    return this._name
  }

  get sql () : string {
    return this._sql
  }

  get schema () : Schema {
    return this._schema
  }

  init () : RunResult {
    return init_table(this.db, this.name, this._sql)
  }

  async create (
    template : z.infer<typeof this.schema.create>
  ) : Promise<RunResult> {
    await this.schema.create.parseAsync(template)
    const keys = Object.keys(template).join(', ')
    const vals = Object.values(template)
    const vars = new Array(keys.length).fill('?').join(', ')
    const sql  = this.db.prepare(`
      INSERT INTO ${this.name} (${keys}) VALUES (${vars})
    `)
    return sql.run(vals)
  }

  async read (
    query : z.infer<typeof this.schema.query>
  ) : Promise<z.infer<typeof this.schema.data>> {
    await this.schema.query.parseAsync(query)
    const keys = join_keys(query, ' AND ')
    const vals = Object.values(query)
    const sql  = this.db.prepare(`SELECT * FROM users WHERE ${keys}`)
    const data = sql.get(vals)
    return this.schema.data.parseAsync(data)
  }

  async update (
    query    : z.infer<typeof this.schema.query>,
    template : z.infer<typeof this.schema.update>
  ) : Promise<RunResult> {
    await this.schema.query.parseAsync(query)
    await this.schema.update.parseAsync(template)
    const temp_keys  = join_keys(template, ', ')
    const temp_vals  = Object.values(template)
    const query_keys = join_keys(query, ' AND ')
    const query_vals = Object.values(query)
    const sql = this.db.prepare(`UPDATE users SET ${temp_keys} WHERE id = ${query_keys}`)
    return sql.run([ ...temp_vals, ...query_vals ])
  }

  async destroy (
    query : z.infer<typeof this.schema.query>
  ) : Promise<RunResult> {
    await this.schema.query.parseAsync(query)
    const keys = join_keys(query, ' AND ')
    const vals = Object.values(query)
    const sql  = this.db.prepare(`DELETE FROM users WHERE ${keys}`)
    return sql.run(vals)
  }
}

function join_keys (obj : Obj, delim = '') {
  return Object.keys(obj).map(e => {
    return `${e} = ?`
  }).join(delim)
}

import { Database }    from 'better-sqlite3'
import { Controller }  from '@/lib/db.js'
import { sql, schema } from '@/data/schema/member.js'

export class ScheduleModel extends Controller {

  constructor (db : Database) {
    super(db, 'schedule', sql, schema)
  }

}

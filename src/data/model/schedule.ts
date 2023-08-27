import { Database }    from 'better-sqlite3'
import { Controller }  from '@/lib/db.js'
import { sql, schema } from '@/data/schema/schedule.js'

export class ScheduleModel extends Controller {

  constructor (db : Database) {
    super(db, 'schedule', sql, schema)
  }

  get_current_schedule() {
    const sql  = `SELECT * FROM schedule WHERE start_date >= ? AND end_date <= ?`
    const stmt = this.db.prepare(sql)
    const data = stmt.get(0, 1)
  }

}

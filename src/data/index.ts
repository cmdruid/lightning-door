import { connect } from '@/lib/db.js'

import { ScheduleModel } from '@/data/model/schedule.js'

export const db = connect('./dev.db')

export const model = {
  schedule : new ScheduleModel(db)
}

if (process.env.NODE_ENV === 'development') {
  Object.values(model).map(e => e.init())
}

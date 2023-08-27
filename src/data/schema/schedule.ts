import { z } from 'zod'

export const sql = `
  id INTEGER PRIMARY KEY,
  name       TEXT,
  policy     TEXT,
  start_date INTEGER,
  end_date   INTEGER
`

export const schema = {
  create : z.object({}),
  data   : z.object({}),
  query  : z.object({}),
  update : z.object({})
}

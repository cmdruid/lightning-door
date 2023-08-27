import { z } from 'zod'

export const sql = `
  id INTEGER PRIMARY KEY,
  name       TEXT CHECK (LENGTH(name) <= 50),
  email      TEXT CHECK (LENGTH(email) <= 50),
  phone      TEXT CHECK (LENGTH(phone) <= 12),
  link_key   TEXT CHECK (LENGTH(link_key) <= 64),
  start_date INTEGER,
  end_date   INTEGER
`

const create = z.object({
  name       : z.string().max(50),
  email      : z.string().email().max(50),
  phone      : z.string().max(12),
  link_key   : z.string().max(64),
  start_date : z.number(),
  end_date   : z.number()
})

const data   = create.extend({ id : z.number() })
const query  = create.optional()
const update = create.optional()

export const schema = { create, data, query, update }

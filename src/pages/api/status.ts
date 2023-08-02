import type { NextApiRequest, NextApiResponse } from 'next'

import { Buff }          from '@cmdcode/buff-utils'
import { withSession }   from '@/lib/session'
import { fetch_invoice } from '@/lib/lnd'

export default withSession(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req
  const { invoice_id }    = query

  if (
    method !== 'GET' ||
    typeof invoice_id !== 'string'
  ) {
    return res.status(400).json({
      ok : false,
      message : 'Bad request!'
    })
  }

  try {
    const r_hash  = Buff.hex(invoice_id).base64
    const invoice = await fetch_invoice(r_hash)

    if (!invoice.ok) {
      console.log(invoice.error)
      return res.status(500).json({
        ok      : false,
        message : 'Failed to fetch invoice from lightning node. Please try again.'
      })
    }

    const { state, settle_date, value } = invoice.data

    if (state === 'SETTLED') {
      req.session.is_paid = true 
      req.session.paid_at = Number(settle_date)
    } else {
      req.session.is_paid = false
      req.session.paid_at = undefined
    }

    await req.session.save()

    return res.status(200).json({
      ok   : true, 
      data : {
        value,
        is_paid : req.session.is_paid,
        paid_at : req.session.paid_at
      }
    })
  } catch (err) {
    console.error(err)
    const { message } = err as Error
    return res.status(500).json({ error: message })
  }
}

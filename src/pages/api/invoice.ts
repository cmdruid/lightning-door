import type { NextApiRequest, NextApiResponse } from 'next'

import { Buff }           from '@cmdcode/buff-utils'
import { config, schedule }         from '@/schema/config'
import { create_invoice } from '@/lib/lnd'
import { check_schedule, get_schedule } from '@/lib/schedule'
import { now } from '@/lib/utils'

const { HOST_URL } = config

export default handler

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req
  const { amount } = query

  if (method !== 'GET') {
    return res.status(400).end()
  }
  
  const schedule_data = get_schedule()

  if (
    schedule_data === null ||
    !check_schedule(now())
  ) {
    return res.status(403).json({
      status : 'ERROR',
      reason : 'We are currently closed to new day-pass entries. Please check the door schedule for more information.'
    })
  }

  const [ _open, _close, rate ] = schedule_data


  const meta  = Buff.json([['text/plain', 'lightning door']])
  const msats = rate * 1000

  if (typeof amount !== 'string') {
    return res.status(200).json({
      callback    : HOST_URL + '/api/invoice',
      maxSendable : msats,
      minSendable : msats,
      metadata    : meta.str,
      tag         : 'payRequest'
    })
  }
  
  const hash    = meta.digest.hex
  const invoice = await create_invoice({ amount: msats, hash })

  if (!invoice.ok) {
    console.log(invoice.error)
    return res.status(500).json({
      status : 'ERROR',
      reason : 'Failed to fetch invoice from lightning node. Please try again.'
    })
  }

  const { payment_request, r_hash } = invoice.data
  const invoice_id = Buff.base64(r_hash).hex

  return res.status(200).json({
    pr     : payment_request,
    routes : [],
    successAction: {
      tag         : 'url',
      description : 'Click the link to view your pass and unlock the door:',
      url         : HOST_URL + `/pass/${invoice_id}`
    }
  })
}

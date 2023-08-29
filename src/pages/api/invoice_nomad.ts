import type { NextApiRequest, NextApiResponse } from 'next'

import { Buff }             from '@cmdcode/buff-utils'
import { MONTHLY_RATE, config, schedule } from '@/schema/config'
import { create_invoice }   from '@/lib/lnd'

const { HOST_URL } = config

// lnurl1dp68gurn8ghj7er0daezuurvv43xcctz9ejx2a30v9cxjtmfdemx76trv40kummdv9jqqcq8xs

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
  
  const rate = MONTHLY_RATE;
  const meta  = Buff.json([['text/plain', 'lightning door - nomad']])
  const msats = rate * 1000

  if (typeof amount !== 'string') {
    return res.status(200).json({
      callback    : HOST_URL + '/api/invoice_nomad',
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
      description : 'Click the link to view your pass and unlock the door for the month:',
      url         : HOST_URL + `/pass/${invoice_id}`
    }
  })
}

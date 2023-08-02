import type { NextApiRequest, NextApiResponse } from 'next'

import { Gpio } from 'onoff'

import { withSession }    from '@/lib/session'
import { check_schedule } from '@/lib/schedule'
import { sleep }          from '@/lib/utils'

const relay = new Gpio(17, 'out')

async function toggle_relay() {
  await relay.write(1)
  await sleep(5000)
  relay.write(0)
}

export default withSession(handler)

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, session }  = req
  const { is_paid, paid_at } = session

  if (method !== 'GET') {
    console.log('Bad request!')
    return res.status(400).json({ ok : false, message : 'Bad request!' })
  }

  if (
    is_paid === false ||
    typeof paid_at !== 'number'
  ) {
    console.log('Unauthorized!')
    return res.status(401).json({ ok : false, message : 'Pass is not authorized!' })
  }

  if (check_schedule(paid_at)) {
    console.log('door unlocked!')
    toggle_relay()
    return res.status(200).json({ ok : true, message: 'Door unlocked!' })
  } else {
    console.log('pass expired!')
    return res.status(403).json({ ok : false, message : 'Pass has expired!' })
  }
}

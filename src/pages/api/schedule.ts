import type { NextApiRequest, NextApiResponse } from 'next'

import { model } from '@/data'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method !== 'GET') {
    console.log('Bad request!')
    return res.status(400).end()
  }


  return res.status(200).json({ error: 'not implemented' })
}

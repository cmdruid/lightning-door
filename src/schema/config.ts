import { Schedule } from '@/schema/types'

export const config = {
  HOST_URL : 'https://door.pleblab.dev',
  // HOST_URL : 'http://localhost:3000',
}

export const schedule : Schedule = {
  mon : [ 7, 19, 35000 ],
  tue : [ 7, 19, 21    ],
  wed : [ 7, 19, 2100  ],
  thu : [ 7, 19, 2100  ],
  fri : [ 7, 19, 2100  ],
  sat : [ 7, 19, 2100  ],
  sun : null
}

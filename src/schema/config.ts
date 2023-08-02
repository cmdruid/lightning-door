import { Schedule } from '@/schema/types'

export const config = {
  HOST_URL : 'https://door.pleblab.dev',
  // HOST_URL : 'http://localhost:3000',
}

export const schedule : Schedule = {
  mon : [ 9, 17, 35 ],
  tue : [ 9, 17, 21 ],
  wed : [ 9, 17, 35 ],
  thu : [ 9, 17, 35 ],
  fri : [ 9, 17, 35 ],
  sat : null,
  sun : null
}

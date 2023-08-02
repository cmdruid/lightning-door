import { Schedule } from '@/schema/types'

export const config = {
  // HOST_URL : 'https://door.pleblab.dev',
  HOST_URL : 'http://localhost:3000',
}

export const schedule : Schedule = {
  mon : [ 9, 17, 35000 ],
  tue : [ 9, 17, 21 ],
  wed : [ 9, 17, 35000 ],
  thu : [ 9, 17, 35000 ],
  fri : [ 9, 17, 35000 ],
  sat : null,
  sun : null
}

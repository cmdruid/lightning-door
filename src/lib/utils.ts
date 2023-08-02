import { Buff } from '@cmdcode/buff-utils'

export const buffer = Buff.bytes
export const random = Buff.random

export const now = () => Math.floor(Date.now() / 1000)

export function sleep (ms : number = 500) {
  return new Promise(res => setTimeout(res, ms))
}

export function is_diff <A, B> (a : A, b : B) : boolean {
  return JSON.stringify(a) !== JSON.stringify(b)
}

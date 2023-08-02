import { ClientSession } from '@/lib/session'

declare module 'iron-session' {
  interface IronSessionData extends ClientSession<SessionData> {}
}

export interface SessionData {
  is_paid ?: boolean
  paid_at ?: number
}

export type ScheduleData = [
  open  : number,
  close : number,
  rate  : number
]

export interface Schedule {
  [ key : string ] : ScheduleData | null,
}
import { Schedule, schedule } from '@/schema'

const days = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ]

const now     = () => Math.floor(Date.now() / 1000)
const get_dow = (ts : number = now()) => days[new Date(ts * 1000).getDay()]
const get_dom = (ts : number = now()) => new Date(ts * 1000).getDate()
const get_hrs = (ts : number = now()) => new Date(ts * 1000).getHours()
const get_min = (ts : number = now()) => new Date(ts * 1000).getMinutes()
const get_sec = (ts : number = now()) => new Date(ts * 1000).getSeconds()

export const Time = {
  now,
  dow : get_dow,
  dom : get_dom,
  hrs : get_hrs,
  min : get_min,
  sec : get_sec
}

export function get_schedule() {
  return schedule[get_dow()]
}

export function check_schedule(ts : number) {
  // Get current day of week.
  const curr_dow = get_dow()
  // If provided timestamp is not current:
  if (get_dow(ts) !== curr_dow) {
    // Return false.
    return false
  }
  // Get hours for current day.
  const hours = schedule[curr_dow as keyof Schedule]
  // If no schedule is set:
  if (hours === null) {
    // Return false.
    return false
  }
  // Get opening hours for current day:
  const [ open, close ] = hours
  // Get the current hour.
  const curr_hr = get_hrs()
  console.log('curr hr:', curr_hr)
  // If current hour does not fall within open hours:
  if (curr_hr < open || curr_hr >= close) {
    // Return false.
    return false
  }
  // Return true.
  return true
}
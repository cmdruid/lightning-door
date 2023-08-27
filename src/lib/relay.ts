import { Gpio }  from 'onoff'
import { sleep } from '@/lib/utils'

const relay = new Gpio(17, 'out')

export async function toggle_relay() {
  await relay.write(1)
  await sleep(5000)
  relay.write(0)
}

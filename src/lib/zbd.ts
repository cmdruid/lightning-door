import { fetcher, Res } from '@/lib/fetch'

const { ZBD_HOST, ZBD_KEY } = process.env

if (typeof ZBD_HOST !== 'string') {
  throw new Error('ZBD_HOST is undefined!')
}

if (typeof ZBD_KEY !== 'string') {
  throw new Error('ZBD_KEY is undefined!')
}

export type ChargeResponse  = ZBDResponse<ChargeData>
export type PaymentResponse = ZBDResponse<PaymentData>

export interface ChargeConfig extends ZBDConfig {
  expiresIn ?: number
}

export interface ZBDConfig {
  internalId  ?: string
  callbackUrl ?: string
}

export interface InvoiceData {
  id     : string
  unit   : string
  amount : string
  description : string
  status      : string
  confirmedAt : string | null
  internalId  : string
}

export interface ChargeData extends InvoiceData {
  createdAt   : string
  expiresAt   : string
  id          : string
  callbackUrl : string
  invoice   : {
    uri     : string
    request : string
  }
}

export interface PaymentData extends InvoiceData {
  fee         : string
  preimage    : string
  processedAt : string
  confirmedAt : string
  invoice     : string
}

export interface ZBDResponse<T> {
  success : true,
  message : string
  data    : T
}

function get_headers (type ?: string) {
  const headers = new Headers({ apikey : ZBD_KEY ?? '' })
  if (type !== undefined) {
    if (type === 'json') {
      headers.set('content-type', 'application/json')
    }
  }
  return headers
}

export function create_charge (
  amount : number,
  desc   : string,
  config : ChargeConfig = {}
) : Promise<Res<ChargeResponse>> {
  const url = `${ZBD_HOST}/v0/charges`
  const opt = {
    headers : get_headers('json'),
    method  : 'POST',
    body    : JSON.stringify({ amount, description: desc, ...config })
  }
  console.log('POST:', url, opt)
  return fetcher(url, opt)
}

export function get_charge (
  charge_id : string
) : Promise<Res<ChargeResponse>> {
  const url = `${ZBD_HOST}/v0/charges/${charge_id}`
  const opt = { headers: get_headers(), method : 'GET' }
  return fetcher(url, opt)
}

export function send_payment (
  invoice : string,
  config  : ZBDConfig = {}
) : Promise<Res<PaymentResponse>> {
  const url = `${ZBD_HOST}/v0/payments`
  const opt = {
    headers : get_headers('json'),
    method  : 'POST',
    body    : JSON.stringify({ invoice, ...config })
  }
  console.log('send_payment:', opt)
  return fetcher(url, opt)
}

export function get_payment (
  payment_id : string
) : Promise<Res<PaymentResponse>> {
  const url = `${ZBD_HOST}/v0/payments/${payment_id}`
  const opt = { headers:  get_headers(), method : 'GET' }
  return fetcher(url, opt)
}
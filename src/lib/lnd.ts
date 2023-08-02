import { Buff } from '@cmdcode/buff-utils'

export type APIResponse<T> = APISuccess<T> | APIFailure

interface HTLC {
  chan_id            : string
  htlc_index         : string
  amt_msat           : string
  accept_height      : number
  accept_time        : string
  resolve_time       : string
  expiry_height      : number
  state              : string
  custom_records     : unknown
  mpp_total_amt_msat : string
  amp                : unknown
}

export interface Invoice {
  memo              : string
  r_preimage        : string
  r_hash            : string
  value             : string
  value_msat        : string
  creation_data     : string
  settle_date       : string
  payment_request   : string
  description_hash  : string
  expiry            : string
  fallback_addr     : string
  cltv_expiry       : string
  route_hints       : unknown[][]
  private           : boolean
  add_index         : string
  settle_index      : string
  amt_paid_sat      : string
  amt_paid_msat     : string
  state             : string
  htlcs             : HTLC[]
  features          : unknown[]
  is_keysend        : boolean
  payment_addr      : string
  is_amp            : boolean
  amp_invoice_state : unknown[]
}

interface CreateInvoiceResponse {
  r_hash          : string
  payment_request : string
  add_index       : string
  payment_addr    : string
}

interface CreateInvoiceParams {
  amount : number
  hash  ?: string
  memo  ?: string
}

interface APISuccess<T> {
  ok     : true
  data   : T
  error ?: string
}

interface APIFailure {
  ok    : false
  data ?: any
  error : string
}

const { LND_HOSTNAME, LND_MACAROON } = process.env

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
}

export async function getInfo () {
  return fetcher('/v1/getinfo')
}

export async function create_invoice (
  { amount, hash, memo } : CreateInvoiceParams
) : Promise<APIResponse<CreateInvoiceResponse>> {
  const body : Record<string, string> = { value_msat: String(amount) }
  if (hash !== undefined) {
    body.description_hash = Buff.hex(hash).base64
  }
  if (memo !== undefined) body.memo = memo
  const opt = {
    method  : 'POST',
    body    : JSON.stringify(body)
  }
  return fetcher('/v1/invoices', opt)
}

export async function fetch_invoice (
  hash : string
) : Promise<APIResponse<Invoice>> {
  const urlsafe = hash.replaceAll('+', '-').replaceAll('/', '_')
  return fetcher('/v2/invoices/lookup?payment_hash=' + urlsafe)
}

export async function cancel_invoice (
  hash : string
) : Promise<APIResponse<any>> {
  const body : Record<string, string> = { payment_hash: hash }
  const opt = {
    method  : 'POST',
    body    : JSON.stringify(body)
  }
  return fetcher('/v2/invoices/cancel?payment_hash=' + hash, opt)
}

async function fetcher <T = any> (
  endpoint : string, 
  opt      : RequestInit = {}
) : Promise<APIResponse<T>> {
  if (LND_HOSTNAME === undefined) {
    throw new Error('Environment varaible \'LND_HOSTNAME\' is undefined!')
  }

  if (LND_MACAROON === undefined) {
    throw new Error('Environment varaible \'LND_MACAROON\' is undefined!')
  }

  opt.headers = { 
    ...opt.headers,
    'Grpc-Metadata-macaroon': LND_MACAROON
  }

  const res = await fetch(new URL(LND_HOSTNAME + endpoint), opt)
  const { ok, status, statusText } = res

  try {
    if (!ok) {
      let data, error
      try { 
        data  = await res.json() 
        error = data.message
      } catch { error = statusText }
      console.error(`[LND] Request failed for endpoint ${endpoint}:`, status, statusText, data, endpoint, opt)
      return { ok, data, error }
    }
    return { ok, data: await res.json() }
  } catch (err) {
    console.log(`[LND] Request failed for endpoint ${endpoint}:`, err)
    const { message } = err as Error
    return { ok: false, error: message }
  }

}

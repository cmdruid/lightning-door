type RateData = RateSuccess | RateError

interface RateSuccess {
  ok      : true
  data    : number
  error  ?: string
  updated : number
}

interface RateError {
  ok      : false
  data   ?: number
  error   : string
  updated : number
}

const now = () => Math.floor(Date.now() / 1000)

const RATE_EXP = 60 * 60 * 12 // 12 hours.

export let rate : RateData = {
  ok      : false,
  error   : 'init',
  updated : now()
}

export async function convert_usd_sats (usd_amount : number) {

  try {
    // Try to process the following:
    if (
      !rate.ok                        ||
      typeof rate.data !== 'number'   ||
      rate.updated + RATE_EXP < now()
    ) {
      // Fetch current price from exchange.
      const res = await fetch('https://cex.io/api/last_price/BTC/USD')
      // If response fails:
      if (!res.ok) {
        // Set an error state.
        const { status, statusText } = res
        rate = {
          ok      : false,
          error   : `${status}${statusText}`,
          updated : now()
        }
      } else {
        // Unpack the latest price from the payload.
        const { lprice } = await res.json()
        // Get the ratio of Bitcoin relative to the price (of 1 BTC).
        const ratio = usd_amount / Number(lprice)
        // Return the ratio converted into satoshis.
        rate = {
          ok      : true,
          data    : Math.ceil(ratio * 100_000_000),
          updated : now()
        }
      }
    }
  } catch (err) {
    // If above logic fails, set an error state.
    const { message } = err as Error
    rate = {
      ok      : false,
      error   : message,
      updated : now()
    }
  } finally {
    // Always return the rate object.
    return rate
  }
}

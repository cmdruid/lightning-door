export type Res<T = any> = PassResponse<T> | FailResponse

interface PassResponse<T> {
  ok     : true
  data   : T
  error ?: string
}

interface FailResponse {
  ok    : false
  data ?: any
  error : string
}

export async function fetcher<T> (
  input : RequestInfo | URL,
  init ?: RequestInit
) : Promise<Res<T>> {
  try {
    // Unpack response object.
    const res = await fetch(input, init)
    const { ok, status, statusText } = res
    // If initial response fails:
    if (!ok) {
      // Return the response status as error.
      const error = `[${status}]: ${statusText}`
      // Try to return a json payload.
      try {
        const data = await res.json()
        return { ok, data, error }
      } catch {
        return { ok, error }
      }
    }
    // Unpack the json response.
    const data = await res.json()
    // If an err object is present:
    if (data.error !== undefined) {
      // Return the err as response.
      return { ok: false, data, error: data.error }
    }
    // Return the data as generic type.
    return { ok, data: data as T }
  } catch (err) {
    // Capture the exception message.
    const { message } = err as Error
    // Log the full error to console.
    console.log(err)
    // Return the error message as response.
    return { ok: false, error: `[000]: ${message}` }
  }
}

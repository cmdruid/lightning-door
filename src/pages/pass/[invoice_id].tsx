import Head from 'next/head'

import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { useToast }  from '@/hooks/useToast'
import { Invoice }   from '@/lib/lnd'

export default function Pass () {
  const [ disabled, setDisabled ] = useState(false)
  const [ data, setData ]   = useState<Invoice>()
  const [ Toast, setToast ] = useToast()

  const router = useRouter()

  const { invoice_id } = router.query

  const fetchData = useCallback(async () => {
    const res = await fetch('../api/status?invoice_id=' + invoice_id)
    const { ok, data, message } = await res.json()
    if (ok) {
      setData(data)
    } else {
      setToast(message)
    }
  }, [ invoice_id, setToast ])

  async function unlock () {
    setDisabled(true)
    const res = await fetch('../api/unlock')
    const { message } = await res.json()
    setToast(message)
    setTimeout(() => setDisabled(false), 5000)
  }

  useEffect(() => {
    if (
      data === undefined &&
      typeof invoice_id === 'string'
    ) { fetchData() }
  }, [ data, invoice_id, fetchData ])

  return (
    <>
      <Head>
        <title>Pass Details</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container">
          <Toast />
          <div className="content">
            <h1>Pass Status:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <button 
              onClick={unlock}
              disabled={disabled}
            >
              Unlock Door
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

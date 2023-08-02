import Head       from 'next/head'
import QRCode     from '@/components/QRCode'
import Schedule   from '@/components/Schedule'
import { Buff }   from '@cmdcode/buff-utils'
import { config } from '@/schema'

const { HOST_URL } = config

const code = Buff
  .str(HOST_URL + '/api/invoice')
  .toBech32('lnurl')

export default function Home() {
  return (
    <>
      <Head>
        <title>Lightning Door</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="title">
        <h1>Lightning Door</h1>
      </div>
      <main className="main">
        <div className="container">
          <div className="content">
            <p>Scan the QR code with your lightning wallet in order to purchase a day pass.</p>
            <QRCode data={code} title={'Day Pass: 35000 sats'}/>
            <br />
            <i>Note: Lightning wallet must support LNURL pay.</i>
          </div>
          <Schedule />
        </div>
      </main>
    </>
  )
}

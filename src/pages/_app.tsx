import '@/styles/globals.css'
import '@/styles/sakura.css'
import '@/styles/layout.css'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

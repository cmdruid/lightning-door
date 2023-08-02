import {
  ReactElement,
  useEffect,
  useState
} from 'react'

import qrcode       from 'qrcode'
import Image        from 'next/image'
import useClipboard from '@/hooks/useClipboard'

import styles from './styles.module.css'

interface Props {
  data     : string,
  title   ?: string,
  loading ?: boolean,
}

export default function QRCode(
  { data, title, loading } : Props
) : ReactElement {
  const [ qrData, setQrData ]   = useState<string>('')
  const [ isCopied, setCopied ] = useClipboard(data)

  title = title ?? ''

  const cls = [ styles.qrcode ]

  useEffect(() => {
    if (data) {
      (async function() { 
        const qrdata = await qrcode.toDataURL(data)
        setQrData(qrdata)
      })()
    }
  }, [ data ])

  if (loading) cls.push(styles.loading)

  return (
    <div className={styles.qrcode}>
      { title && 
        <div 
          className={styles.title}
          style={{borderRadius: title ? '10px 10px 0 0' : ''}}
          >
            {title}
          </div> }
      <Image
        className={styles.image}
        style={{borderRadius: title ? '' : '10px 10px 0 0'}}
        src={qrData}
        alt="QR Code"
        width={300}
        height={300}
      />
      <div
        className={styles.button}
        onClick={setCopied}>
          { isCopied ? "Copied to clipboard!" : "Copy Lightning-URL Code"}
      </div>
    </div>
  )
}

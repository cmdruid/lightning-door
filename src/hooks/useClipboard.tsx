import { useState, useEffect } from 'react'

type ClipboardHook = [
  isCopied  : boolean,
  setCopied : () => void
]

export default function useClipboard(
  content  : string,
  duration : number = 2000
) : ClipboardHook {
  const [ isCopied, setIsCopied ] = useState(false)

  useEffect(() => {
    if (isCopied && duration) {
      const id = setTimeout(() => {
        setIsCopied(false)
      }, duration)

      return () => { clearTimeout(id) }
    }
  }, [ isCopied, duration ])


  const setCopied = () => {
    navigator.clipboard.writeText(content)
    setIsCopied(true)
  }

  return [ isCopied, setCopied ]
}
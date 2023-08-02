import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState
} from 'react'

type ToastAPI = [
  FC,
  Dispatch<SetStateAction<string | undefined>>
]

export function useToast () : ToastAPI {
  const [ toast, setToast ] = useState<string>()

  const display = (toast !== undefined)
    ? 'block'
    : 'none'

  const Toast = () => (
    <div className="toast">
      { <p style={{ display }}>{toast}</p> }
    </div>
  )

  useEffect(() => {
    if (typeof toast === 'string') {
      setTimeout(() => setToast(undefined), 5000)
    }
  })

  return [ Toast, setToast ] 
}

import { useEffect } from 'react'
import { handleAuthCallback } from '@netlify/identity'

export function CallbackHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    handleAuthCallback().then((result) => {
      if (result) {
        // Clear the hash from the URL after processing
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }).catch((err) => {
      console.error('Auth callback error:', err)
    })
  }, [])

  return <>{children}</>
}

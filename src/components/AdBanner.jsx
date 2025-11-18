import { useEffect, useRef } from 'react'

function AdBanner({ slot = '1234567890', style = {}, className = '' }) {
  const adRef = useRef(null)

  useEffect(() => {
    try {
      if (window && adRef.current) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block', minHeight: 90, ...style }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

export default AdBanner

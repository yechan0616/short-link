'use client'

import { useState, type PropsWithChildren } from 'react'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useServerInsertedHTML } from 'next/navigation'

export default function Provider({ children }: PropsWithChildren) {
  const [cache] = useState(() => {
    const c = createCache({ key: 'css', prepend: true })
    // Enable Emotion v10 compatibility to better support insertion order in SSR
    // and avoid hydration mismatches.
    // See: https://emotion.sh/docs/ssr#context
    // @ts-ignore compat exists at runtime
    c.compat = true
    return c
  })

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted)
    if (names.length === 0) return null
    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: names.map((name) => cache.inserted[name]).join(' ')
        }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}

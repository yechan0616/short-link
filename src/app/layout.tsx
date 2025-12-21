import { ReactNode } from 'react'

import { GlobalStyle } from 'styles'
import Provider from './provider'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: ''
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <Provider>
          <GlobalStyle />
          {children}
        </Provider>
      </body>
    </html>
  )
}

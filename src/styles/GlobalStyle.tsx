'use client'

import { Global, css } from '@emotion/react'

const styled = css`
  *::before,
  *::after,
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html,
  body {
    width: 100%;
    height: 100%;
    font-family: 'Pretendard', sans-serif;
  }
`

export default function GlobalStyle() {
  return <Global styles={styled} />
}

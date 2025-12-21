'use client'

import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const TARGET = new Date('2026-01-13T00:00:00+09:00')

function getTimeLeft(now: number): TimeLeft {
  const diff = Math.max(0, TARGET.getTime() - now)
  const sec = Math.floor(diff / 1000)
  const days = Math.floor(sec / 86400)
  const hours = Math.floor((sec % 86400) / 3600)
  const minutes = Math.floor((sec % 3600) / 60)
  const seconds = sec % 60
  return { days, hours, minutes, seconds }
}

export default function Landing() {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  // 고정된 문자열 및 라벨은 SSR과 CSR에서 동일하여 수화 불일치 방지
  const labels = useMemo(
    () => ({ day: '일', hour: '시간', minute: '분', second: '초' }),
    []
  )

  useEffect(() => {
    setMounted(true)
    // 최초 측정 및 인터벌 시작 (CSR에서만 동작)
    const tick = () => setTimeLeft(getTimeLeft(Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const d = timeLeft?.days
  const h = timeLeft?.hours
  const m = timeLeft?.minutes
  const s = timeLeft?.seconds

  // 수화 안정성: 마운트 전에는 플레이스홀더 출력
  const to2 = (n: number | undefined) =>
    typeof n === 'number' ? String(n).padStart(2, '0') : '--'

  return (
    <Container
      onDragStart={(e) => e.preventDefault()}
      draggable={false}
    >
      <Content>
        <Header>
          <Title>2026. 01. 13</Title>
          <SubTitle>D‑{d ?? '--'}</SubTitle>
        </Header>

        <Countdown role="timer" aria-live="polite">
          <Unit>
            <Value>{to2(h)}</Value>
            <Label>{labels.hour}</Label>
          </Unit>
          <Separator>:</Separator>
          <Unit>
            <Value>{to2(m)}</Value>
            <Label>{labels.minute}</Label>
          </Unit>
          <Separator>:</Separator>
          <Unit>
            <Value>{to2(s)}</Value>
            <Label>{labels.second}</Label>
          </Unit>
        </Countdown>

        <Footer>
          <Desc>그날을 기다리며, 남은 시간을 함께 세어봐요.</Desc>
          {mounted && (
            <SmallNote>Asia/Seoul 기준 2026-01-13 00:00:00</SmallNote>
          )}
        </Footer>
      </Content>
    </Container>
  )
}

export const Container = styled.div`
  width: 100vw;
  /* 모바일 주소창 수축/확장에 안전한 높이 처리 */
  height: 100vh;           /* 기본값 (fallback) */
  min-height: 100vh;       /* 일부 브라우저 호환 */
  min-height: 100dvh;      /* iOS Safari 등 동적 뷰포트 대응 */
  background: linear-gradient(161deg, #000 12.97%, #0A0F1C 81.66%, #0D1117 150.35%);
  color: #ffffff;
  /* 드래그/선택 방지 */
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-user-drag: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent; /* 모바일 탭 하이라이트 제거 */

  /* 모바일 안전 영역 패딩 (노치 대응) */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  /* 내부 요소 이미지/링크 드래그 방지 보조 */
  img,
  a,
  * {
    -webkit-user-drag: none;
    user-drag: none;
  }
`

export const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 0 20px;
  text-align: center;

  @media (max-width: 480px) {
    gap: 20px;
    padding: 0 16px;
  }
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`

const Title = styled.h1`
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 600;
  letter-spacing: 0.02em;
  opacity: 0.9;
`

const SubTitle = styled.h2`
  font-size: clamp(40px, 10vw, 72px);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: 0.06em;
`

const Countdown = styled.div`
  display: flex;
  align-items: flex-end;
  gap: clamp(10px, 3vw, 20px);

  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
    row-gap: 8px;
  }
`

const Unit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 84px;

  @media (max-width: 480px) {
    min-width: 64px;
  }
`

const Value = styled.div`
  font-variant-numeric: tabular-nums;
  font-size: clamp(28px, 12vw, 88px);
  font-weight: 800;
  line-height: 0.95;
`

const Label = styled.div`
  margin-top: 8px;
  font-size: clamp(12px, 2.5vw, 16px);
  opacity: 0.8;
`

const Separator = styled.div`
  font-size: clamp(20px, 8vw, 40px);
  opacity: 0.6;
  padding: 0 2px 10px;

  @media (max-width: 480px) {
    padding: 0 2px 8px;
  }
`

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  opacity: 0.85;

  @media (max-width: 480px) {
    gap: 6px;
    margin-top: 2px;
  }
`

const Desc = styled.p`
  font-size: clamp(12px, 2.6vw, 16px);
`

const SmallNote = styled.small`
  font-size: 12px;
  opacity: 0.6;
`
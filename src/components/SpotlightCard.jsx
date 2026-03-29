import { useRef, useCallback } from 'react'

/**
 * SpotlightCard — Pointer-tracking glow card
 * Uses LOCAL coordinates (relative to card) so glow ONLY appears on the hovered card.
 */

const glowColorMap = {
  blue:   { h: 220, s: 100, l: 70 },
  purple: { h: 280, s: 100, l: 70 },
  green:  { h: 120, s: 100, l: 70 },
  red:    { h: 0,   s: 100, l: 60 },
  orange: { h: 30,  s: 100, l: 65 },
}

export function SpotlightCard({
  children,
  className = '',
  glowColor = 'red',
}) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)

  const { h, s, l } = glowColorMap[glowColor] || glowColorMap.red

  // Use local coordinates — glow only on THIS card
  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    glow.style.setProperty('--glow-x', `${x}px`)
    glow.style.setProperty('--glow-y', `${y}px`)
    glow.style.opacity = '1'
  }, [])

  const handlePointerLeave = useCallback(() => {
    if (glowRef.current) {
      glowRef.current.style.opacity = '0'
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        '--glow-h': h,
        '--glow-s': `${s}%`,
        '--glow-l': `${l}%`,
      }}
    >
      {/* Glow layer — only visible on hover, uses local coords */}
      <div ref={glowRef} className="spotlight-glow-layer" />
      {/* Border glow */}
      <div className="spotlight-border-glow" />
      {children}
    </div>
  )
}

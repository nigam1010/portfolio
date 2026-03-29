import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './EnginePage.css'

/* ── SVG Speedometer Gauge ── */
function Gauge({ size = 240, label, unit, maxVal, currentVal, redZoneStart, ticks = 10 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 20
  const startAngle = 135
  const endAngle = 405
  const totalAngle = endAngle - startAngle

  const needleAngle = startAngle + (currentVal / maxVal) * totalAngle

  const tickMarks = []
  for (let i = 0; i <= ticks; i++) {
    const frac = i / ticks
    const angle = startAngle + frac * totalAngle
    const rad = (angle * Math.PI) / 180
    const inR = r - 18
    const outR = r - 4
    const x1 = cx + Math.cos(rad) * inR
    const y1 = cy + Math.sin(rad) * inR
    const x2 = cx + Math.cos(rad) * outR
    const y2 = cy + Math.sin(rad) * outR
    const val = Math.round((i / ticks) * maxVal)
    const labelR = r - 30
    const lx = cx + Math.cos(rad) * labelR
    const ly = cy + Math.sin(rad) * labelR
    const isRed = val >= redZoneStart

    tickMarks.push(
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={isRed ? '#E10600' : '#555'} strokeWidth={i % 2 === 0 ? 2.5 : 1.2} />
        {i % 2 === 0 && (
          <text x={lx} y={ly} fill={isRed ? '#E10600' : '#888'}
            fontSize="9" textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Orbitron', sans-serif">
            {val}
          </text>
        )}
      </g>
    )
  }

  const arcPath = (radius, start, end) => {
    const s = (start * Math.PI) / 180
    const e = (end * Math.PI) / 180
    const sx = cx + Math.cos(s) * radius
    const sy = cy + Math.sin(s) * radius
    const ex = cx + Math.cos(e) * radius
    const ey = cy + Math.sin(e) * radius
    const large = end - start > 180 ? 1 : 0
    return `M ${sx} ${sy} A ${radius} ${radius} 0 ${large} 1 ${ex} ${ey}`
  }

  const needleRad = (needleAngle * Math.PI) / 180
  const nx = cx + Math.cos(needleRad) * (r - 22)
  const ny = cy + Math.sin(needleRad) * (r - 22)

  return (
    <div className="gauge-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx={cx} cy={cy} r={r - 2} fill="none" stroke="#0d0d0d" strokeWidth="1" />
        <path d={arcPath(r - 10, startAngle, endAngle - (totalAngle * (1 - redZoneStart / maxVal)))}
          fill="none" stroke="#222" strokeWidth="4" strokeLinecap="round" />
        <path d={arcPath(r - 10, endAngle - (totalAngle * (1 - redZoneStart / maxVal)), endAngle)}
          fill="none" stroke="rgba(225,6,0,0.3)" strokeWidth="4" strokeLinecap="round" />
        {tickMarks}
        <line x1={cx} y1={cy} x2={nx} y2={ny}
          stroke="#E10600" strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: 'all 0.15s ease-out', filter: 'drop-shadow(0 0 4px rgba(225,6,0,0.6))' }} />
        <circle cx={cx} cy={cy} r="6" fill="#1a1a1a" stroke="#E10600" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="2.5" fill="#E10600" />
        <text x={cx} y={cy + 35} fill="#888" fontSize="9" textAnchor="middle"
          fontFamily="'Orbitron', sans-serif" letterSpacing="2">{label}</text>
        <text x={cx} y={cy + 50} fill="#555" fontSize="7" textAnchor="middle"
          fontFamily="'Orbitron', sans-serif">{unit}</text>
        <text x={cx} y={cy + 70} fill="#E10600" fontSize="16" textAnchor="middle"
          fontFamily="'Orbitron', sans-serif" fontWeight="700"
          style={{ filter: 'drop-shadow(0 0 6px rgba(225,6,0,0.4))' }}>
          {Math.round(currentVal)}
        </text>
      </svg>
    </div>
  )
}

/* ── Blast Effect (Ultra Smooth 60FPS) ── */
function BlastAndSmoke() {
  return (
    <div className="blast-smoke-overlay">
      <div className="blast-flash-smooth" />
      <div className="blast-ring-smooth" />

      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={`spark-${i}`}
          className="blast-spark-smooth"
          style={{
            '--angle': `${(i / 15) * 360}deg`,
            '--dist': `${150 + Math.random() * 250}px`,
            '--delay': `${Math.random() * 0.1}s`,
            '--size': `${3 + Math.random() * 4}px`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Main Engine Page ── */
export default function EnginePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('idle') // idle, revving, redline, blast, smoke
  const [rpm, setRpm] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [temp, setTemp] = useState(60)
  const frameRef = useRef(null)
  const startTimeRef = useRef(null)

  const handleIgnition = useCallback(() => {
    if (phase !== 'idle') return
    setPhase('revving')
    startTimeRef.current = Date.now()
  }, [phase])

  // Animate gauges + sync audio during revving
  useEffect(() => {
    if (phase !== 'revving') return

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const totalDur = 3.5

      if (elapsed < totalDur) {
        const t = elapsed / totalDur
        const ease = t < 0.3 ? t * 1.5 : 0.45 + (t - 0.3) * 0.78
        const clamped = Math.min(ease, 1)

        const rpmBase = clamped * 9000
        const rpmJitter = Math.sin(elapsed * 15) * (200 * (1 - clamped))
        const currentRpm = Math.min(rpmBase + rpmJitter, 9000)
        setRpm(currentRpm)
        setSpeed(Math.pow(clamped, 1.5) * 320)
        setTemp(60 + clamped * 50)

        setTemp(60 + clamped * 50)

        frameRef.current = requestAnimationFrame(animate)
      } else {
        setRpm(9000)
        setSpeed(320)
        setTemp(110)
        setPhase('redline')
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [phase])

  // Redline → blast → smoke → navigate
  useEffect(() => {
    if (phase === 'redline') {
      setTimeout(() => {
        setPhase('blast')
      }, 800)
    }
    if (phase === 'blast') {
      // The explosion covers the screen in 0.4s and fades its core.
      // Navigate to the portfolio immediately in 0.8s so it happens right behind the explosion flash.
      setTimeout(() => navigate('/home'), 800)
    }
  }, [phase, navigate])

  return (
    <motion.div
      className="engine-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-bg" />

      <AnimatePresence>
        {phase !== 'blast' && phase !== 'smoke' && (
          <motion.div className="engine-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            key="title"
          >
            <span>Karinigam</span> S A — Portfolio
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase !== 'blast' && phase !== 'smoke' && (
          <motion.div className="dashboard-cluster"
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(15px)' }}
            transition={{ duration: 0.4 }}
            key="cluster"
          >
            <motion.div className="gauge-side gauge-left"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Gauge size={200} label="SPEED" unit="KM/H" maxVal={320}
                currentVal={speed} redZoneStart={260} ticks={8} />
            </motion.div>

            <motion.div className="gauge-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 80 }}
            >
              <Gauge size={320} label="RPM" unit="× 1000" maxVal={9}
                currentVal={rpm / 1000} redZoneStart={7} ticks={9} />
              <button
                className={`engine-start-btn ${phase !== 'idle' ? 'active' : ''} ${phase === 'redline' ? 'redline' : ''}`}
                onClick={handleIgnition}
                disabled={phase !== 'idle'}
              >
                <span className="start-icon">⏻</span>
                <span className="start-text">
                  {phase === 'idle' ? 'START' : phase === 'redline' ? 'MAX' : 'REV'}
                </span>
              </button>
            </motion.div>

            <motion.div className="gauge-side gauge-right"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Gauge size={200} label="TEMP" unit="°C" maxVal={120}
                currentVal={temp} redZoneStart={100} ticks={6} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase !== 'blast' && phase !== 'smoke' && (
          <motion.div className="dashboard-bottom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            key="bottom"
          >
            <div className="bottom-indicators">
              <span className={`indicator ${phase !== 'idle' ? 'on' : ''}`}>⦿ IGN</span>
              <span className={`indicator ${rpm > 3000 ? 'on' : ''}`}>⦿ OIL</span>
              <span className={`indicator ${temp > 90 ? 'on warn' : ''}`}>⦿ TEMP</span>
              <span className={`indicator ${phase === 'redline' ? 'on warn' : ''}`}>⦿ REV</span>
            </div>
            <div className="bottom-cta">
              {phase === 'idle' ? 'Press START to ignite'
               : phase === 'redline' ? 'MAX RPM...'
               : `${Math.round(rpm)} RPM`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redline screen shake */}
      {phase === 'redline' && <div className="redline-flash" />}

      {/* Blast + Smoke transition */}
      <AnimatePresence>
        {(phase === 'blast' || phase === 'smoke') && <BlastAndSmoke />}
      </AnimatePresence>
    </motion.div>
  )
}

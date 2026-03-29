/**
 * useEngineSound — Realistic V10/GT3RS Engine Synthesis
 *
 * KEY INSIGHT: Real engines sound "raw" because of COMBUSTION NOISE,
 * not clean sine/saw waves. This version uses:
 *
 *  1. Shaped noise buffers (filtered white noise = exhaust rumble)
 *  2. Resonant bandpass filters tuned to engine harmonics
 *  3. Multiple detuned oscillators for thick growl
 *  4. Amplitude modulation at firing frequency for the "chug/pop" feel
 *  5. Waveshaper distortion for exhaust saturation
 */
import { useRef, useCallback, useEffect } from 'react'

function makeDistortionCurve(amount = 50) {
  const n = 44100
  const curve = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

// Generate a noise buffer for exhaust texture
function createNoiseBuffer(ctx, duration = 2) {
  const length = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

export default function useEngineSound() {
  const ctxRef = useRef(null)
  const nodesRef = useRef(null)
  const isRunning = useRef(false)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  /* ── Ignition Crank ── */
  const playIgnition = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime

    // Starter motor whirr
    const starter = ctx.createOscillator()
    starter.type = 'sawtooth'
    starter.frequency.setValueAtTime(100, now)
    starter.frequency.linearRampToValueAtTime(250, now + 0.35)
    const sGain = ctx.createGain()
    sGain.gain.setValueAtTime(0.05, now)
    sGain.gain.linearRampToValueAtTime(0.10, now + 0.15)
    sGain.gain.linearRampToValueAtTime(0, now + 0.4)
    starter.connect(sGain).connect(ctx.destination)
    starter.start(now)
    starter.stop(now + 0.4)

    // Ignition pops
    for (let i = 0; i < 4; i++) {
      const t = now + 0.2 + i * 0.06
      const popBuf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate)
      const d = popBuf.getChannelData(0)
      for (let j = 0; j < d.length; j++) {
        d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.01))
      }
      const pop = ctx.createBufferSource()
      pop.buffer = popBuf
      const pGain = ctx.createGain()
      pGain.gain.setValueAtTime(0.15, t)
      pGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
      pop.connect(pGain).connect(ctx.destination)
      pop.start(t)
    }
  }, [getCtx])

  /* ── Start Rev ── */
  const startRev = useCallback(() => {
    if (isRunning.current) return
    isRunning.current = true
    const ctx = getCtx()
    const now = ctx.currentTime

    // ═══ LAYER 1: Exhaust Noise (the gritty roar) ═══
    const noiseBuf = createNoiseBuffer(ctx, 2)
    const exhaust = ctx.createBufferSource()
    exhaust.buffer = noiseBuf
    exhaust.loop = true
    exhaust.start(now)

    // Bandpass filter — tuned to engine fundamental for resonance
    const exhaustBP = ctx.createBiquadFilter()
    exhaustBP.type = 'bandpass'
    exhaustBP.frequency.setValueAtTime(120, now)
    exhaustBP.Q.setValueAtTime(2.5, now)

    // Second bandpass for mid-range exhaust character
    const exhaustMid = ctx.createBiquadFilter()
    exhaustMid.type = 'bandpass'
    exhaustMid.frequency.setValueAtTime(350, now)
    exhaustMid.Q.setValueAtTime(1.5, now)

    const exhaustGain = ctx.createGain()
    exhaustGain.gain.setValueAtTime(0, now)
    exhaustGain.gain.linearRampToValueAtTime(0.25, now + 0.5)

    const exhaustMidGain = ctx.createGain()
    exhaustMidGain.gain.setValueAtTime(0, now)
    exhaustMidGain.gain.linearRampToValueAtTime(0.15, now + 0.5)

    // ═══ LAYER 2: Harmonic oscillators (tonal character) ═══
    const oscs = []
    const oscGains = []
    // Fundamental + detuned pairs for thick sound
    const harmonicConfig = [
      { freq: 80, type: 'sawtooth', vol: 0.06, detune: 0 },
      { freq: 82, type: 'sawtooth', vol: 0.04, detune: 7 },    // slight detune = thick
      { freq: 160, type: 'sawtooth', vol: 0.03, detune: -5 },   // 2nd harmonic
      { freq: 240, type: 'square', vol: 0.02, detune: 3 },      // 3rd harmonic
      { freq: 40, type: 'sine', vol: 0.06, detune: 0 },         // sub-bass
    ]

    harmonicConfig.forEach(h => {
      const osc = ctx.createOscillator()
      osc.type = h.type
      osc.frequency.setValueAtTime(h.freq, now)
      osc.detune.setValueAtTime(h.detune, now)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(h.vol, now + 0.5)
      oscs.push(osc)
      oscGains.push(g)
      osc.start(now)
    })

    // ═══ LAYER 3: Amplitude modulation (firing frequency) ═══
    const amLfo = ctx.createOscillator()
    amLfo.type = 'sine'
    amLfo.frequency.setValueAtTime(10, now) // idle firing rate
    const amGain = ctx.createGain()
    amGain.gain.setValueAtTime(0.3, now) // modulation depth

    // ═══ DISTORTION ═══
    const distortion = ctx.createWaveShaper()
    distortion.curve = makeDistortionCurve(60)
    distortion.oversample = '4x'

    // ═══ MASTER ═══
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.6, now)

    // AM modulates the master volume
    amLfo.connect(amGain)
    amGain.connect(master.gain)
    amLfo.start(now)

    // ═══ ROUTING ═══
    // Exhaust noise → two bandpass filters → mix
    const preDist = ctx.createGain()

    exhaust.connect(exhaustBP)
    exhaustBP.connect(exhaustGain)
    exhaustGain.connect(preDist)

    exhaust.connect(exhaustMid)
    exhaustMid.connect(exhaustMidGain)
    exhaustMidGain.connect(preDist)

    // Oscillators → mix
    oscs.forEach((osc, i) => {
      osc.connect(oscGains[i])
      oscGains[i].connect(preDist)
    })

    // Mix → distortion → master → speakers
    preDist.connect(distortion)
    distortion.connect(master)
    master.connect(ctx.destination)

    nodesRef.current = {
      exhaust, exhaustBP, exhaustMid, exhaustGain, exhaustMidGain,
      oscs, oscGains, harmonicConfig,
      amLfo, amGain, distortion, master,
    }
  }, [getCtx])

  /* ── Update Rev (per-frame, RPM 0-9000) ── */
  const updateRev = useCallback((rpm) => {
    if (!nodesRef.current || !ctxRef.current) return
    const ctx = ctxRef.current
    const t = ctx.currentTime
    const n = nodesRef.current
    const frac = rpm / 9000

    // ── Exhaust noise filter: sweep resonance up with RPM ──
    const bpFreq = 120 + frac * 600       // 120Hz → 720Hz
    const midFreq = 350 + frac * 1200     // 350Hz → 1550Hz
    n.exhaustBP.frequency.setTargetAtTime(bpFreq, t, 0.03)
    n.exhaustBP.Q.setTargetAtTime(2.5 + frac * 3, t, 0.03)
    n.exhaustMid.frequency.setTargetAtTime(midFreq, t, 0.03)

    // Exhaust gets louder with RPM
    n.exhaustGain.gain.setTargetAtTime(0.25 + frac * 0.35, t, 0.03)
    n.exhaustMidGain.gain.setTargetAtTime(0.15 + frac * 0.25, t, 0.03)

    // ── Oscillator frequencies track RPM ──
    const baseFreq = 80 + frac * 420
    n.oscs[0].frequency.setTargetAtTime(baseFreq, t, 0.03)
    n.oscs[1].frequency.setTargetAtTime(baseFreq * 1.02, t, 0.03)  // detuned
    n.oscs[2].frequency.setTargetAtTime(baseFreq * 2, t, 0.03)      // 2nd
    n.oscs[3].frequency.setTargetAtTime(baseFreq * 3, t, 0.03)      // 3rd
    n.oscs[4].frequency.setTargetAtTime(baseFreq * 0.5, t, 0.03)    // sub

    // Volume: high harmonics get louder at high RPM (scream!)
    n.oscGains[0].gain.setTargetAtTime(0.06 + frac * 0.04, t, 0.03)
    n.oscGains[1].gain.setTargetAtTime(0.04 + frac * 0.03, t, 0.03)
    n.oscGains[2].gain.setTargetAtTime(0.03 + frac * 0.05, t, 0.03)
    n.oscGains[3].gain.setTargetAtTime(0.02 + frac * frac * 0.06, t, 0.03) // exponential scream
    n.oscGains[4].gain.setTargetAtTime(Math.max(0.06 - frac * 0.03, 0.02), t, 0.03)

    // ── AM firing frequency increases with RPM ──
    const fireRate = 10 + frac * 70
    n.amLfo.frequency.setTargetAtTime(fireRate, t, 0.03)
    // Modulation depth decreases at high RPM (smoother)
    n.amGain.gain.setTargetAtTime(Math.max(0.3 - frac * 0.2, 0.05), t, 0.03)

    // ── Master volume rises ──
    n.master.gain.setTargetAtTime(0.6 + frac * 0.4, t, 0.03)
  }, [])

  /* ── Stop Rev ── */
  const stopRev = useCallback(() => {
    if (!nodesRef.current || !ctxRef.current) return
    const t = ctxRef.current.currentTime
    const n = nodesRef.current
    n.master.gain.setTargetAtTime(0, t, 0.06)

    setTimeout(() => {
      try {
        n.exhaust.stop()
        n.oscs.forEach(o => o.stop())
        n.amLfo.stop()
      } catch(e) {}
      nodesRef.current = null
      isRunning.current = false
    }, 200)
  }, [])

  /* ── BOOM Explosion ── */
  const playBoom = useCallback(() => {
    const ctx = getCtx()
    const now = ctx.currentTime

    // Layer 1: Massive sub impact
    const sub = ctx.createOscillator()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(90, now)
    sub.frequency.exponentialRampToValueAtTime(12, now + 1.0)
    const subG = ctx.createGain()
    subG.gain.setValueAtTime(0.7, now)
    subG.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
    sub.connect(subG).connect(ctx.destination)
    sub.start(now)
    sub.stop(now + 1.2)

    // Layer 2: Explosion crackle (filtered noise)
    const crackBuf = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = crackBuf.getChannelData(ch)
      for (let i = 0; i < d.length; i++) {
        const decay = Math.exp(-i / (ctx.sampleRate * 0.25))
        d[i] = (Math.random() * 2 - 1) * decay
      }
    }
    const crack = ctx.createBufferSource()
    crack.buffer = crackBuf
    const crackLP = ctx.createBiquadFilter()
    crackLP.type = 'lowpass'
    crackLP.frequency.setValueAtTime(3000, now)
    crackLP.frequency.exponentialRampToValueAtTime(100, now + 1.0)
    const crackG = ctx.createGain()
    crackG.gain.setValueAtTime(0.5, now)
    crackG.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
    crack.connect(crackLP).connect(crackG).connect(ctx.destination)
    crack.start(now)

    // Layer 3: "BROOM" — descending distorted roar
    const roar = ctx.createOscillator()
    roar.type = 'sawtooth'
    roar.frequency.setValueAtTime(600, now)
    roar.frequency.exponentialRampToValueAtTime(30, now + 0.7)
    const roar2 = ctx.createOscillator()
    roar2.type = 'square'
    roar2.frequency.setValueAtTime(450, now)
    roar2.frequency.exponentialRampToValueAtTime(20, now + 0.8)
    const roarDist = ctx.createWaveShaper()
    roarDist.curve = makeDistortionCurve(100)
    const roarG = ctx.createGain()
    roarG.gain.setValueAtTime(0.2, now)
    roarG.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
    const roarMix = ctx.createGain()
    roar.connect(roarMix)
    roar2.connect(roarMix)
    roarMix.connect(roarDist).connect(roarG).connect(ctx.destination)
    roar.start(now); roar2.start(now)
    roar.stop(now + 0.9); roar2.stop(now + 0.9)

    // Layer 4: Metallic debris
    const clang = ctx.createOscillator()
    clang.type = 'triangle'
    clang.frequency.setValueAtTime(1800, now)
    clang.frequency.exponentialRampToValueAtTime(150, now + 0.2)
    const clangG = ctx.createGain()
    clangG.gain.setValueAtTime(0.1, now)
    clangG.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
    clang.connect(clangG).connect(ctx.destination)
    clang.start(now); clang.stop(now + 0.25)
  }, [getCtx])

  useEffect(() => {
    return () => {
      try {
        if (nodesRef.current) {
          nodesRef.current.exhaust.stop()
          nodesRef.current.oscs.forEach(o => o.stop())
          nodesRef.current.amLfo.stop()
        }
        if (ctxRef.current) ctxRef.current.close()
      } catch(e) {}
    }
  }, [])

  return { playIgnition, startRev, updateRev, stopRev, playBoom }
}

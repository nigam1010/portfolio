import { MeshGradient } from '@paper-design/shaders-react'
import './ShaderBackground.css'

/**
 * Racing-themed shader background using @paper-design/shaders-react MeshGradient.
 * Uses our existing racing color palette — deep blacks, carbon grays, subtle red accents, and white highlights.
 */
export default function ShaderBackground({ speed = 0.15, className = '' }) {
  return (
    <div className={`shader-bg-container ${className}`}>
      {/* Primary mesh gradient layer — dark racing palette */}
      <MeshGradient
        className="shader-bg-layer"
        colors={['#0a0a0a', '#1a1a1a', '#2a0000', '#ffffff']}
        speed={speed}
        backgroundColor="#0a0a0a"
      />

      {/* Secondary overlay layer for depth — very subtle red accent */}
      <div className="shader-bg-overlay" />

      {/* Vignette for cinematic racing feel */}
      <div className="shader-bg-vignette" />
    </div>
  )
}

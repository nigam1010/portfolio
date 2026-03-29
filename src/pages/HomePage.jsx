import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import ShaderBackground from '../components/ShaderBackground'
import { SpotlightCard } from '../components/SpotlightCard'
import { PROJECTS, SKILLS, CONTACT_LINKS } from '../data/portfolioData'
import profileImg from '../assets/profile.png'
import avatarImg from '../assets/avatar.png'
import '../components/SpotlightCard.css'
import './HomePage.css'

/* Canvas hook removed — now using ShaderBackground component with @paper-design/shaders-react */

/* ───── Section Wrapper with Scroll Animation ───── */
function Section({ id, children, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      className={`section ${className}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}

/* ───── Skill Orbit Node ───── */
function SkillNode({ skill, index, total, isActive, onClick }) {
  const angle = (index / total) * 360 - 90 // start from top
  const radius = 180

  return (
    <div
      className={`orbit-node ${isActive ? 'active' : ''}`}
      style={{
        '--angle': `${angle}deg`,
        '--radius': `${radius}px`,
      }}
      onClick={onClick}
    >
      <div className="orbit-node-icon">
        <span>{skill.icon}</span>
      </div>
      <span className="orbit-node-label">{skill.name}</span>
    </div>
  )
}

/* ───── Skill Detail Card (shown on click) ───── */
function SkillDetailCard({ skill, allSkills }) {
  if (!skill) return null

  const connected = allSkills.filter(s => skill.connectedTo.includes(s.id))

  return (
    <motion.div
      className="skill-detail-card"
      initial={{ opacity: 0, x: '-50%', y: '-40%', scale: 0.9 }}
      animate={{ opacity: 1, x: '-50%', y: '-50%', scale: 1 }}
      exit={{ opacity: 0, x: '-50%', y: '-40%', scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      key={skill.id}
    >
      <div className="skill-detail-status">
        <span className="skill-status-badge">{skill.status}</span>
      </div>

      <h3 className="skill-detail-title">{skill.name}</h3>
      <p className="skill-detail-desc">{skill.description}</p>

      <div className="skill-detail-bar-section">
        <div className="skill-bar-header">
          <span>✦ Proficiency</span>
          <span>{skill.level}%</span>
        </div>
        <div className="skill-bar-track">
          <motion.div
            className="skill-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="skill-detail-tags">
        {skill.skills.map(s => (
          <span key={s} className="skill-tag">{s}</span>
        ))}
      </div>

      {connected.length > 0 && (
        <div className="skill-connected">
          <span className="skill-connected-label">⟁ CONNECTED NODES</span>
          <div className="skill-connected-list">
            {connected.map(c => (
              <span key={c.id} className="skill-connected-node">{c.shortName} →</span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}


/* ───── Main Home Page ───── */
export default function HomePage() {
  const navigate = useNavigate()
  const projectsTrackRef = useRef(null)
  const [activeSkill, setActiveSkill] = useState(null)

  // Auto-scroll projects
  useEffect(() => {
    const track = projectsTrackRef.current
    if (!track) return
    let scrollPos = 0
    let paused = false
    let animId

    const autoScroll = () => {
      if (!paused) {
        scrollPos += 0.5
        if (scrollPos >= track.scrollWidth - track.clientWidth) {
          scrollPos = 0
        }
        track.scrollLeft = scrollPos
      }
      animId = requestAnimationFrame(autoScroll)
    }

    track.addEventListener('mouseenter', () => { paused = true })
    track.addEventListener('mouseleave', () => { paused = false; scrollPos = track.scrollLeft })

    animId = requestAnimationFrame(autoScroll)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Shader Background */}
      <ShaderBackground />

      {/* Navigation */}
      <Navbar />

      {/* Scrollable content */}
      <div className="page-content">

        {/* ═══ HERO SECTION ═══ */}
        <section id="hero" className="section hero-section">
          <div className="hero-left">
            <motion.div
              className="hero-number"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              ▸ Driver #01
            </motion.div>

            <motion.h1
              className="hero-name"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Karinigam <span className="accent">S A</span>
            </motion.h1>

            <motion.p
              className="hero-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Product Manager · Full Stack Developer
            </motion.p>

            <motion.div
              className="hero-divider"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            />

            <motion.p
              className="hero-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              MCA graduate from CMR University, Bengaluru. Building products at the intersection of
              <em> technology</em> and <em> user experience</em>. From full-stack engineering to
              product strategy — driven by curiosity, fueled by impact.
            </motion.p>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <div className="stat"><span className="stat-val">5+</span><span className="stat-lbl">Projects</span></div>
              <div className="stat"><span className="stat-val">1</span><span className="stat-lbl">Research Paper</span></div>
              <div className="stat"><span className="stat-val">MERN</span><span className="stat-lbl">Stack</span></div>
            </motion.div>

            <motion.button
              className="hero-cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Projects <span className="cta-arrow">→</span>
            </motion.button>
          </div>

          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: 0.8, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1, type: 'spring', stiffness: 80 }}
          >
            <div className="profile-frame">
              <div className="profile-ring" />
              <div className="profile-ring ring-2" />
              <img src={profileImg} alt="Karinigam S A" className="profile-img" />
              <div className="profile-glow" />
            </div>
          </motion.div>
        </section>

        {/* ═══ PROJECTS SECTION ═══ */}
        <Section id="projects" className="projects-section">
          <div className="section-header">
            <span className="section-tag">▸ Pit Lane</span>
            <h2 className="section-title">Projects</h2>
            <p className="section-subtitle">End-to-end products I've built with passion</p>
          </div>

          <div className="projects-track" ref={projectsTrackRef}>
            {[...PROJECTS, ...PROJECTS].map((proj, i) => (
              <SpotlightCard
                key={`${proj.id}-${i}`}
                glowColor="red"
                className="project-spotlight-card"
              >
                <div
                  className="spotlight-project-content"
                  style={{ '--card-accent': proj.color }}
                  onClick={() => navigate(`/project/${proj.id}`)}
                >
                  <div className="spotlight-project-accent" />
                  
                  {/* Mirrored Transparent Background Watermark */}
                  {proj.image && (
                    <div 
                      className="spotlight-project-bg-mirror"
                      style={{ backgroundImage: `url(${proj.image})` }}
                    />
                  )}

                  {proj.image ? (
                    <img src={proj.image} alt={proj.title} className="spotlight-project-image" />
                  ) : (
                    <span className="spotlight-project-icon">{proj.icon}</span>
                  )}
                  <h3 className="spotlight-project-title">{proj.title}</h3>
                  <p className="spotlight-project-subtitle">{proj.subtitle}</p>
                  <p className="spotlight-project-desc">{proj.description}</p>
                  <div className="spotlight-project-tech">
                    {proj.tech.slice(0, 4).map(t => (
                      <span key={t} className="spotlight-tech-badge">{t}</span>
                    ))}
                  </div>
                  <span className="spotlight-project-arrow">View Details →</span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </Section>

        {/* ═══ SKILLS SECTION — ORBITAL NODES ═══ */}
        <Section id="skills" className="skills-section">
          <div className="section-header">
            <span className="section-tag">▸ Telemetry</span>
            <h2 className="section-title">Skills</h2>
            <p className="section-subtitle">Six paths of expertise</p>
          </div>

          <div className="orbit-container">
            {/* Center Avatar Image */}
            <div className="orbit-center-avatar">
              <img src={avatarImg} alt="3D Avatar" />
            </div>

            {/* Orbit rings */}
            <div className="orbit-ring" />
            <div className="orbit-ring orbit-ring-inner" />

            {/* Nodes */}
            {SKILLS.map((skill, i) => (
              <SkillNode
                key={skill.id}
                skill={skill}
                index={i}
                total={SKILLS.length}
                isActive={activeSkill?.id === skill.id}
                onClick={() => setActiveSkill(
                  activeSkill?.id === skill.id ? null : skill
                )}
              />
            ))}

            {/* Detail card inside the orbit */}
            <AnimatePresence mode="wait">
              {activeSkill && (
                <SkillDetailCard skill={activeSkill} allSkills={SKILLS} />
              )}
            </AnimatePresence>
          </div>
        </Section>

        {/* ═══ CONTACT SECTION ═══ */}
        <Section id="contact" className="contact-section">
          <div className="section-header">
            <span className="section-tag">▸ Finish Line</span>
            <h2 className="section-title">Contact</h2>
            <p className="section-subtitle">Let's connect and build something great</p>
          </div>

          <div className="contact-grid">
            {CONTACT_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
              >
                <span className="contact-icon">{link.icon}</span>
                <span className="contact-label">{link.label}</span>
                <span className="contact-value">{link.value}</span>
              </a>
            ))}
          </div>

          <div className="footer-stripe">
            <p>© 2025 Karinigam S A — Built with 🏁 and React</p>
          </div>
        </Section>
      </div>

      {/* Bottom racing stripe */}
      <div className="racing-stripe" />
    </motion.div>
  )
}

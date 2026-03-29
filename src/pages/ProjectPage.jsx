import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PROJECTS } from '../data/portfolioData'
import './ProjectPage.css'

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = PROJECTS.find(p => p.id === id)

  if (!project) {
    return (
      <motion.div
        className="project-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="project-page-bg" />
        <button className="project-back-btn" onClick={() => navigate('/home')}>
          ← Back
        </button>
        <div className="project-content project-not-found">
          <h2>Project Not Found</h2>
          <p>This project doesn't exist in the garage.</p>
          <button className="project-back-btn" onClick={() => navigate('/home')} style={{ position: 'static' }}>
            ← Return to Portfolio
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="project-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="project-page-bg" />

      <button className="project-back-btn" onClick={() => navigate('/home')}>
        ← Back to Portfolio
      </button>

      <div className="project-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {project.image ? (
            <img src={project.image} alt={project.title} className="project-page-image" />
          ) : (
            <div className="project-page-icon">{project.icon}</div>
          )}
          <h1 className="project-page-title">{project.title}</h1>
          <p className="project-page-subtitle">{project.subtitle}</p>
          <div
            className="project-page-divider"
            style={{ background: project.color }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="project-page-tech-container"
        >
          <h3 className="project-page-section-title">▸ Tech Stack</h3>
          <div className="project-page-tech">
            {project.tech.map(t => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>
        </motion.div>

        {project.sections?.map((section, idx) => {
          const delay = 0.4 + idx * 0.1;
          
          if (section.type === 'text') {
            return (
              <motion.div
                key={idx}
                className="project-section text-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
              >
                <h3 className="project-page-section-title">{section.title}</h3>
                <p className="project-page-description">{section.content}</p>
              </motion.div>
            )
          }

          if (section.type === 'list') {
            return (
              <motion.div
                key={idx}
                className="project-section list-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
              >
                <h3 className="project-page-section-title">{section.title}</h3>
                <ul className="project-page-highlights">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            )
          }

          if (section.type === 'features') {
            return (
              <motion.div
                key={idx}
                className="project-section features-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
              >
                <h3 className="project-page-section-title">{section.title}</h3>
                <div className="project-features-grid">
                  {section.items.map((item, i) => (
                    <div key={i} className="feature-card">
                      <h4 className="feature-title">{item.title}</h4>
                      <p className="feature-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          }

          if (section.type === 'gallery') {
            return (
              <motion.div
                key={idx}
                className="project-section gallery-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
              >
                <h3 className="project-page-section-title">{section.title}</h3>
                <div className="project-gallery-grid">
                  {section.images.map((imgSrc, i) => (
                    <div key={i} className="gallery-image-wrapper">
                      <img src={imgSrc} alt={`${project.title} screenshot ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          }

          if (section.type === 'link') {
            return (
              <motion.div
                key={idx}
                className="project-section link-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay }}
              >
                <a 
                  href={section.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-external-link-btn"
                >
                  {section.label} ↗
                </a>
              </motion.div>
            )
          }

          return null
        })}
      </div>
    </motion.div>
  )
}

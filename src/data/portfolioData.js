import crmImg from '../assets/crm.png'
import porscheImg from '../assets/porsche.png'
import botImg from '../assets/bot.png'
import driverImg from '../assets/driver.png'
import avatarImg from '../assets/avatar.png'
import moto1Img from '../assets/Moto1.png'
import moto2Img from '../assets/Moto2.png'
import moto3Img from '../assets/Moto3.png'

export const PROJECTS = [
  {
    id: 'motomind',
    title: 'MotoMind',
    subtitle: 'AI-Powered Premium Car Configurator',
    description: 'A full-stack, AI-extendable car configurator designed to deliver a premium digital showroom experience.',
    tech: ['React', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'PayPal'],
    color: '#FFD700',
    image: porscheImg,
    sections: [
      {
        type: 'text',
        title: '🎯 Problem Statement',
        content: 'Most existing car configurators offer only basic customization, lack intelligent recommendations, provide static non-interactive UI, don’t integrate purchase workflows, and have no personalization.\n\nMotoMind solves this by creating a real-time, intelligent, and end-to-end car buying experience.'
      },
      {
        type: 'list',
        title: '💡 Solution',
        items: [
          'Real-time car customization (trim, color, wheels)',
          'Dynamic pricing engine (instant updates)',
          '“My Garage” for saving configurations',
          'PayPal-based checkout simulation',
          'AI-ready architecture for future recommendations & assistant'
        ]
      },
      {
        type: 'gallery',
        title: '🔗 Portfolio Showcase',
        images: [moto1Img, moto2Img, moto3Img]
      },
      {
        type: 'features',
        title: '🧠 Key Features',
        items: [
          { title: '⚡ Real-time Engine', desc: 'Instant UI + price updates without reload' },
          { title: '🚗 Personal Garage', desc: 'Save, revisit, compare builds' },
          { title: '💳 End-to-End Flow', desc: 'From selection → customization → payment' },
          { title: '🤖 AI-Ready', desc: 'Designed for NLP assistant + recommendations' }
        ]
      },
      {
        type: 'text',
        title: '🏗️ System Architecture',
        content: '• Frontend: React + Vite + TailwindCSS\n• Backend: Node.js + Express\n• APIs: REST-based modular architecture\n• Payment: PayPal SDK (sandbox)\n• Database: JSON (prototype) → scalable to MongoDB/Postgres'
      },
      {
        type: 'text',
        title: '📊 Impact & Value',
        content: 'Simulates a real automotive sales funnel, reduces dependency on physical showrooms, enables data-driven personalization, and can be scaled into a real SaaS product for dealerships.'
      }
    ]
  },
  {
    id: 'canovacrm',
    title: 'CanovaCRM',
    subtitle: 'Role-Based Unified CRM',
    description: 'A full-stack CRM system designed to streamline business operations through role-based interfaces, enabling both admins and employees to operate efficiently.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Vercel'],
    color: '#E10600',
    image: crmImg,
    sections: [
      {
        type: 'link',
        title: '',
        url: 'https://github.com/nigam1010/canova-crm-project',
        label: 'View Repository'
      },
      {
        type: 'text',
        title: '🎯 Problem Statement',
        content: 'Traditional CRMs have cluttered interfaces, don’t adapt to user roles gracefully, and often lack mobile optimization for field employees.'
      },
      {
        type: 'text',
        title: '💡 Solution',
        content: 'A single application with dynamic UI rendering based on user roles:\n• Admin → Full management dashboard\n• Employee → Mobile-first daily interface'
      },
      {
        type: 'features',
        title: '🧠 Core Capabilities',
        items: [
          { title: '👨‍💼 Admin Dashboard', desc: 'Employee management, lead management, and CSV bulk uploads' },
          { title: '📱 Employee App', desc: 'Check-in/out tracking, break logs, scheduled tasks' },
          { title: '🔐 Security', desc: 'Strict role-based authentication and unified routing' },
          { title: '📊 Analytics', desc: 'Daily activity tracking and live telemetry reporting' }
        ]
      },
      {
        type: 'text',
        title: '💡 Highlight for Product Managers',
        content: 'This project strongly demonstrates Product Thinking, User Segmentation, and solving Real-world Workflow Design friction.'
      }
    ]
  },
  {
    id: 'multilingual-iot',
    title: 'Multilingual Voice IoT',
    subtitle: 'AI-Powered Smart Controller',
    description: 'An AI-powered IoT system enabling voice-based control of devices and vehicles using multilingual natural language commands.',
    tech: ['Python', 'Raspberry Pi', 'MQTT', 'LLM API', 'Speech API'],
    color: '#00D4FF',
    image: botImg,
    sections: [
      {
        type: 'link',
        title: '',
        url: 'https://github.com/nigam1010/multilingual-car-control',
        label: 'View Repository'
      },
      {
        type: 'text',
        title: '🎯 Problem Statement',
        content: 'Standard IoT systems are not intuitive, require manual tactile control, and completely lack multilingual accessibility for non-English users.'
      },
      {
        type: 'text',
        title: '💡 Solution',
        content: 'A voice assistant powered by LLM and MQTT that handles natural language commands in real-time, completely bypassing standard app interfaces for pure vocal orchestration.'
      },
      {
        type: 'features',
        title: '🧠 Key Features',
        items: [
          { title: '🌍 Multilingual Support', desc: 'Simultaneous pipeline handles English, Hindi, and Kannada' },
          { title: '🤖 LLM Brain', desc: 'Context-aware command handling parsed via GPT/Claude' },
          { title: '🎙️ STT Pipeline', desc: 'Flawless speech-to-text paired with TTS replies' },
          { title: '🔗 MQTT Comms', desc: 'Instantaneous telemetry broadcast across HiveMQ broker' }
        ]
      },
      {
        type: 'list',
        title: '📊 Use Cases',
        items: [
          'Smart home automation',
          'Voice-controlled vehicles & embedded car tech',
          'Accessibility systems for non-technical users'
        ]
      }
    ]
  },
  {
    id: 'driver-behavior',
    title: 'Driver Behavior ML',
    subtitle: 'Published Research',
    description: 'A machine learning system to classify driving behavior using telematics data, improving road safety and predictive analytics.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'TensorFlow', 'CNN & LSTM'],
    color: '#FF6B35',
    image: driverImg,
    sections: [
      {
        type: 'link',
        title: '',
        url: 'https://ijctjournal.org/driver-behavior-classification-ml-telematics/',
        label: 'View Published Paper'
      },
      {
        type: 'text',
        title: '🎯 Problem Statement',
        content: 'High accident rates stem directly from human behavior on the road, coupled with a fundamental lack of real-time behavior monitoring frameworks.'
      },
      {
        type: 'text',
        title: '💡 Solution',
        content: 'A hybrid ML + Deep Learning system that classifies and scores behavior into Normal, Aggressive, or Drowsy driving using the UAH-DriveSet pipeline.'
      },
      {
        type: 'features',
        title: '⚙️ Technical Pipeline',
        items: [
          { title: '📡 Data Collection', desc: 'Continuous telemetry ingestion via GPS and onboard sensors' },
          { title: '🧠 Machine Learning', desc: 'Implemented Random Forest, SVM, CNN, and LSTM' },
          { title: '📈 Evaluation Ops', desc: 'Benchmarked Accuracy, Precision, Recall, and F1-score' }
        ]
      },
      {
        type: 'text',
        title: '🏆 Achievement',
        content: 'Successfully published as a first-author research paper directly indexed on Google Scholar, paving the way for implementations in Insurance Risk Scoring and Fleet Management.'
      }
    ]
  },
  {
    id: 'portfolio-website',
    title: 'Racing Portfolio',
    subtitle: 'This F1-Themed App',
    description: 'A racing-themed portfolio website unifying cinematic intro sequences, flowing animations, and immersive design language.',
    tech: ['React', 'Vite', 'Framer Motion', 'Canvas API', 'CSS'],
    color: '#E10600',
    image: avatarImg,
    sections: [
      {
        type: 'text',
        title: '🏁 The Checkered Flag',
        content: 'Designed and built this portfolio website specifically adopting a unified F1/motorsport theme to act as my ultimate interactive business card.\n\nEvery interaction is structured structurally around a real-time racing experience, merging technical frontend expertise with visceral product design.'
      },
      {
        type: 'list',
        title: '✨ Highlight Reel',
        items: [
          'Engine-start cinematic intro leveraging custom SVG masks',
          'Canvas-based flowing light trails',
          'Framer Motion page transitions',
          'Dynamic state-driven component lifecycle routing'
        ]
      }
    ]
  }
]

export const SKILLS = [
  {
    id: 'fsd',
    name: 'Full Stack',
    shortName: 'FSD',
    icon: '⟨/⟩',
    status: 'EXPERT',
    level: 85,
    description: 'End-to-end web development from UI to database. React, Node.js, Express, MongoDB — the full MERN stack.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'JWT Auth'],
    connectedTo: ['design', 'pm'],
  },
  {
    id: 'pm',
    name: 'Product',
    shortName: 'PM',
    icon: '◎',
    status: 'ADVANCED',
    level: 75,
    description: 'Product strategy, user research, wireframing, roadmaps, and A/B testing. Bridging tech and business.',
    skills: ['User Research', 'Wireframing', 'Roadmaps', 'A/B Testing', 'Agile'],
    connectedTo: ['fsd', 'da'],
  },
  {
    id: 'da',
    name: 'Analytics',
    shortName: 'DA',
    icon: '◈',
    status: 'ADVANCED',
    level: 70,
    description: 'Data analysis, visualization, and insight extraction. Python, Pandas, Matplotlib for decision-driven development.',
    skills: ['Python', 'Pandas', 'Matplotlib', 'SQL', 'Tableau'],
    connectedTo: ['aiml', 'pm'],
  },
  {
    id: 'aiml',
    name: 'AI / ML',
    shortName: 'AI',
    icon: '◇',
    status: 'INTERMEDIATE',
    level: 60,
    description: 'Machine learning pipelines, NLP, recommendation systems. TensorFlow, Scikit-learn for intelligent applications.',
    skills: ['TensorFlow', 'Scikit-learn', 'NLP', 'Classification', 'Neural Nets'],
    connectedTo: ['da', 'iot'],
  },
  {
    id: 'iot',
    name: 'IoT',
    shortName: 'IoT',
    icon: '◉',
    status: 'INTERMEDIATE',
    level: 55,
    description: 'Connected devices, MQTT protocol, Raspberry Pi, sensor data, and voice-controlled smart home systems.',
    skills: ['Raspberry Pi', 'MQTT', 'Sensors', 'Speech API', 'Arduino'],
    connectedTo: ['fsd', 'aiml'],
  },
  {
    id: 'design',
    name: 'Design',
    shortName: 'UI',
    icon: '◐',
    status: 'ADVANCED',
    level: 72,
    description: 'UI/UX design, responsive layouts, CSS animations, Three.js 3D experiences, and premium visual aesthetics.',
    skills: ['Figma', 'CSS3', 'Framer Motion', 'Three.js', 'Responsive'],
    connectedTo: ['fsd', 'pm'],
  },
]

export const CONTACT_LINKS = [
  {
    label: 'Email',
    icon: '✉️',
    href: 'mailto:karinigam03@gmail.com',
    value: 'karinigam03@gmail.com',
  },
  {
    label: 'GitHub',
    icon: '💻',
    href: 'https://github.com/nigam1010',
    value: 'github.com/nigam1010',
  },
  {
    label: 'LinkedIn',
    icon: '🔗',
    href: 'https://linkedin.com/in/karinigamsa',
    value: 'linkedin.com/in/karinigamsa',
  },
]

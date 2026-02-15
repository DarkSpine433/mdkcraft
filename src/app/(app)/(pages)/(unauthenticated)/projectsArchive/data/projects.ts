import {
  Activity,
  Box,
  Cloud,
  Code2,
  Cpu,
  Database,
  Eye,
  Layers,
  Layout,
  Network,
  Server,
  Settings,
  Share2,
  Smartphone,
  Sparkles,
  Terminal,
  Wind,
  Zap
} from 'lucide-react'
import { Project, ProjectCategory, TechStackItem } from '../types/project'

// -----------------------------------------------------------------------------
// 1. EXTENDED TECH POOL (For variety)
// -----------------------------------------------------------------------------

export const TECH_POOL: TechStackItem[] = [
  { name: 'React 19', icon: Code2, category: 'frontend', description: 'Next-gen UI library with compiler support.' },
  { name: 'Next.js 15', icon: Box, category: 'frontend', description: 'Full-stack React framework.' },
  { name: 'TypeScript', icon: Code2, category: 'core', description: 'Strongly typed JavaScript.' },
  { name: 'Rust', icon: Settings, category: 'backend', description: 'Memory-safe systems programming.' },
  { name: 'Go', icon: Terminal, category: 'backend', description: 'Cloud-native microservices.' },
  { name: 'Python', icon: Code2, category: 'backend', description: 'Data science and ML core.' },
  { name: 'Node.js', icon: Server, category: 'backend', description: 'Event-driven runtime.' },
  { name: 'GraphQL', icon: Share2, category: 'backend', description: 'Flexible API query language.' },
  { name: 'PostgreSQL', icon: Database, category: 'backend', description: 'Advanced relational database.' },
  { name: 'Redis', icon: Layers, category: 'backend', description: 'Ultra-fast in-memory storage.' },
  { name: 'AWS', icon: Network, category: 'cloud', description: 'Global cloud infrastructure.' },
  { name: 'Docker', icon: Box, category: 'devops', description: 'Containerization engine.' },
  { name: 'Kubernetes', icon: Server, category: 'devops', description: 'Orchestration for scale.' },
  { name: 'Tailwind', icon: Layout, category: 'frontend', description: 'Utility-first CSS styling.' },
  { name: 'Three.js', icon: Box, category: 'frontend', description: 'High-performance 3D graphics.' },
  { name: 'Prisma', icon: Database, category: 'backend', description: 'Type-safe SQL toolkit.' },
  { name: 'Stripe', icon: Zap, category: 'core', description: 'Global payment processing.' },
  { name: 'OpenAI', icon: Sparkles, category: 'core', description: 'State-of-the-art LLM integration.' },
  { name: 'Solidity', icon: Code2, category: 'backend', description: 'Ethereum smart contracts.' },
  { name: 'Flutter', icon: Smartphone, category: 'mobile', description: 'Multi-platform mobile UI.' },
  { name: 'TensorFlow', icon: Cpu, category: 'backend', description: 'Comprehensive ML framework.' },
  { name: 'Elixir', icon: Wind, category: 'backend', description: 'Concurrent, fault-tolerant functional language.' },
  { name: 'Supabase', icon: Database, category: 'backend', description: 'Open source Firebase alternative.' },
  { name: 'Firebase', icon: Cloud, category: 'core', description: 'Mobile and web app platform.' },
  { name: 'Svelte', icon: Zap, category: 'frontend', description: 'Cybernetically enhanced web apps.' },
  { name: 'Vue', icon: Layout, category: 'frontend', description: 'Progressive JS framework.' },
  { name: 'Dapr', icon: Network, category: 'devops', description: 'Distributed application runtime.' },
  { name: 'Terraform', icon: Layers, category: 'devops', description: 'Infrastructure as Code.' },
  { name: 'Cypress', icon: Activity, category: 'devops', description: 'Fast, easy, reliable E2E testing.' },
  { name: 'Storybook', icon: Eye, category: 'frontend', description: 'Component documentation tool.' }
]

// -----------------------------------------------------------------------------
// 2. MASSIVE CONTENT POOLS (To avoid repetition)
// -----------------------------------------------------------------------------

export const TITLES_PREFIX = [
  'Quantum', 'Aether', 'Nexus', 'Vortex', 'Hyper', 'Cyber', 'Stellar', 'Orbital', 'Flux', 'Zenith', 
  'Apex', 'Nova', 'Echo', 'Prism', 'Spectral', 'Titan', 'Iron', 'Neon', 'Carbon', 'Plasma', 
  'Omega', 'Alpha', 'Delta', 'Gamma', 'Sigma', 'Kappa', 'Zeta', 'Phi', 'Psi', 'Void',
  'Origin', 'Eon', 'Aion', 'Chronos', 'Astra', 'Lumina', 'Mantis', 'Kraken', 'Phoenix', 'Icarus',
  'Nebula', 'Quasar', 'Pulsar', 'Void', 'Horizon', 'Event', 'Singularity', 'Gravity', 'Force', 'Kinetic',
  'Aura', 'Ghost', 'Shadow', 'Light', 'Dark', 'Mirror', 'Glass', 'Steel', 'Titanium', 'Cobalt',
  'Mercury', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Sapphire', 'Ruby', 'Topaz', 'Onyx', 'Quartz'
]

export const TITLES_SUFFIX = [
  'Engine', 'Dashboard', 'Protocol', 'Network', 'Systems', 'Labs', 'Space', 'Flow', 'Grid', 'Core', 
  'Vision', 'Sphere', 'Matrix', 'Dynamics', 'Solutions', 'Portal', 'Vault', 'Hub', 'Bridge', 'Link',
  'Sync', 'Thread', 'Pulse', 'Wave', 'Beam', 'Ray', 'Spark', 'Cloud', 'Node', 'Relay',
  'Sentinel', 'Guardian', 'Oracle', 'Cipher', 'Code', 'Draft', 'Blueprint', 'Framework', 'Nexus', 'Point',
  'Interface', 'OS', 'Shell', 'Kernel', 'Chain', 'Block', 'Lead', 'Path', 'Way',
  'Logic', 'Mind', 'Brain', 'Neural', 'Synapse', 'Gate', 'Key', 'Lock', 'Safe'
]

export const CLIENTS = [
  'TechFlow Inc.', 'Global Systems', 'Future Corp', 'Innovate LLC', 'Alpha Group', 'Omega Dynamics', 
  'Prime Solutions', 'Elite Digital', 'Core Tech', 'Virtucon', 'Stark Industries', 'Wayne Ent.', 
  'Cyberdyne', 'Umbrella Co.', 'Massive Dynamic', 'Aperture Science', 'Oscorp', 'Tyrell Corp',
  'Hooli', 'Pied Piper', 'Nakamoto Labs', 'Ethereum Foundation', 'Solana Labs', 'Polygon Zero',
  'Starfleet', 'Weyland-Yutani', 'Ingen', 'Soylent Corp', 'Wonka Industries', 'Globex', 'MomCorp',
  'Vandelay Industries', 'Dunder Mifflin', 'Prestige Worldwide', 'E Corp', 'Allsafe', 'Fsociety'
]

export const OVERVIEWS = [
  'A state-of-the-art platform designed to revolutionize how enterprises handle real-time data streaming and complex event processing.',
  'An immersive digital experience that blurs the line between physical and virtual storefronts, leveraging WebGL for 3D exploration.',
  'A secure, decentralized ledger system focused on transparency and high-throughput transaction verification for retail users.',
  'An AI-driven analytics suite that provides predictive insights into market trends with a sub-second response time architecture.',
  'A comprehensive IoT management hub that coordinates thousands of smart devices across urban infrastructure for better city planning.',
  'A high-performance gaming backend capable of supporting millions of concurrent players with minimal network jitter.',
  'A medical data visualization tool that enables doctors to analyze 3D scans with augmented reality overlays in real-time.',
  'A sustainable energy monitoring system that optimizes power distribution grids using machine learning at the edge.',
  'A collaborative workspace platform featuring real-time document editing with advanced end-to-end encryption protocols.',
  'A localized supply chain management tool that uses geospatial data to optimize logistics across deep-sea shipping routes.',
  'A next-generation social layer for the decentralized web, allowing users to own their data and social graphs securely.',
  'An autonomous drone coordination system for precision agriculture, optimizing crop yields through multispectral imaging.',
  'A quantum-resistant encryption suite for government-level communications, utilizing lattice-based cryptography standards.',
  'A real-time translation engine for low-resource languages, leveraging advanced transformer models and synthetic data.',
  'A personalized nutrition advisor that uses genetic data and real-time biometric tracking to suggest optimal dietary choices.'
]

export const CHALLENGES = [
  'Developing a system that could maintain 100% data integrity while processing over 10 million transactions per hour across distributed nodes.',
  'Integrating legacy 1990s mainframe APIs with modern GraphQL microservices without introducing significant latency or downtime.',
  'Ensuring consistent 60FPS rendering on low-end mobile devices for a highly complex 3D interface involving ray-casted lighting.',
  'Implementing massive-scale user authentication that is completely passwordless and relies on biometric zero-knowledge proofs.',
  'Scaling the database architecture to handle petabytes of unstructured telemetry data from thousands of satellite sensors.',
  'Reducing the end-to-end latency of a global video conferencing platform to under 50ms for users in remote geographical areas.',
  'Managing high-frequency financial trades where even a microsecond of delay could result in significant capital loss for clients.',
  'Building a resilient decentralized network that can withstand partitioned network attacks and coordinate global consensus.',
  'Designing a user interface that is fully accessible to visually impaired users while maintaining a high-fidelity visual aesthetic.',
  'Optimizing the resource consumption of background AI models to ensure long battery life on modern wearable devices.',
  'Avoiding race conditions in a highly concurrent environment where state updates occur thousands of times per second.',
  'Maintaining backward compatibility with 15-year-old API consumers while migrating the entire infrastructure to a serverless model.',
  'Filtering out malicious bot traffic that simulates human behavior with 99.9% accuracy to protect advertising revenue.',
  'Synchronizing state across millions of globally distributed edge nodes with eventual consistency within 100ms.',
  'Automating the detection of security vulnerabilities in third-party dependencies before they reach the production environment.'
]

export const SOLUTIONS = [
  'We architected a globally distributed multi-region system using Kubernetes and custom operator logic for automated failover.',
  'Our team developed a proprietary caching strategy that utilizes edge workers to pre-compute and store frequently accessed user content.',
  'We utilized Rust and WebAssembly to offload heavy computational tasks from the main thread, ensuring a silky smooth user experience.',
  'By implementing an event-driven architecture using Kafka, we decoupled data ingestion from processing, allowing for independent scaling.',
  'We created a custom 3D engine built on top of Three.js that uses instanced rendering and GPU-accelerated shaders for better performance.',
  'A specialized AI model was fine-tuned and deployed using ONNX runtime to provide immediate on-device inference without server roundtrips.',
  'We designed a multi-layer security protocol that combines hardware security modules with advanced elliptic curve cryptography.',
  'Our engineers implemented a localized database sync mechanism that allows for full offline functionality with conflict-free resolution.',
  'We built a highly modular UI system that allows for dynamic theme switching and component hot-swapping based on user permissions.',
  'The final solution involved a hybrid cloud strategy, leveraging on-premise hardware for sensitive data and public clouds for scale.',
  'We implemented a custom Raft-based consensus algorithm to ensure data consistency across multiple cloud providers simultaneously.',
  'Our engineers built a specialized compiler toolchain that optimizes React components for near-instantaneous initial rendering.',
  'We utilized Zero-Knowledge Proofs to allow users to verify their identity without ever sharing sensitive personal information.',
  'A custom observability pipeline was built using OpenTelemetry to provide deep insights into every single microservice request.',
  'We pioneered the use of a graph-based database schema to represent complex relationships between millions of disparate data points.'
]

export const IMPACTS = [
  'Resulted in a 400% increase in user engagement and zero downtime during peak traffic events exceeding 1M concurrent users.',
  'Reduced operational costs by $2.5M annually by optimizing cloud resource allocation and eliminating redundant server clusters.',
  'Achieved a Lighthouse performance score of 100 across all core pages, significantly boosting search engine visibility globally.',
  'Improved transaction speed by 10x, enabling the client to process orders faster than any of their primary market competitors.',
  'Increased data accuracy from 85% to 99.9% by implementing automated validation pipelines and ML-based anomaly detection.',
  'Scaled the platform from zero to 10 million daily active users within six months without manual intervention from the dev team.',
  'Reduced the time-to-market for new feature deployments from weeks to minutes through a fully automated CI/CD pipeline.',
  'Decreased user bounce rates by 60% due to a more intuitive design and significantly faster initial page load times.',
  'Helped the client secure $50M in Series B funding by demonstrating a robust, production-ready system with clear growth metrics.',
  'Transformed the customer support workflow, reducing average ticket resolution time by 75% using AI-driven automation.',
  'Enabled the organization to enter three new international markets within a single quarter due to the highly portable architecture.',
  'Reduced the average response time for global users from 2.5 seconds to 450 milliseconds, drastically improving satisfaction.',
  'Automated 90% of routine maintenance tasks, allowing the engineering team to focus entirely on high-impact new features.',
  'Established a new industry standard for security, resulting in the organization receiving several prestigious technology awards.',
  'Successfully protected the organization from a massive DDoS attack of 2Tbps without any impact on legitimate user traffic.'
]

// -----------------------------------------------------------------------------
// 3. DETERMINISTIC RANDOM GENERATOR
// -----------------------------------------------------------------------------

export const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// -----------------------------------------------------------------------------
// 4. MASSIVE PROJECT GENERATION (100+ UNIQUE ENTRIES)
// -----------------------------------------------------------------------------

export const generateProjects = (count: number): Project[] => {
  return Array.from({ length: count }).map((_, i) => {
    const seed = (i + 1) * 777
    
    // Select unique strings from pools
    const title_pre = TITLES_PREFIX[Math.floor(pseudoRandom(seed + 1) * TITLES_PREFIX.length)]
    const title_suf = TITLES_SUFFIX[Math.floor(pseudoRandom(seed + 2) * TITLES_SUFFIX.length)]
    const client = CLIENTS[Math.floor(pseudoRandom(seed + 3) * CLIENTS.length)]
    const overview = OVERVIEWS[Math.floor(pseudoRandom(seed + 4) * OVERVIEWS.length)]
    const challenge = CHALLENGES[Math.floor(pseudoRandom(seed + 5) * CHALLENGES.length)]
    const solution = SOLUTIONS[Math.floor(pseudoRandom(seed + 6) * SOLUTIONS.length)]
    const impact = IMPACTS[Math.floor(pseudoRandom(seed + 7) * IMPACTS.length)]
    
    // Select 6 unique tech items
    const selectedTech: TechStackItem[] = []
    const tempPool = [...TECH_POOL]
    for (let j = 0; j < 6; j++) {
      const idx = Math.floor(pseudoRandom(seed + j + 20) * tempPool.length)
      selectedTech.push(tempPool[idx])
      tempPool.splice(idx, 1)
    }
    
    // Random status
    const statuses: Project['status'][] = ['completed', 'completed', 'completed', 'in-progress', 'maintenance']
    const status = statuses[Math.floor(pseudoRandom(seed + 8) * statuses.length)]
    
    // Random category
    const categories: ProjectCategory[] = ['E-commerce', 'FinTech', 'Healthcare', 'AI/ML', 'Blockchain', 'IoT', 'SaaS', 'Social']
    const category = categories[Math.floor(pseudoRandom(seed + 9) * categories.length)]

    return {
      id: `PROJECT_REF_${(i + 100).toString(16).toUpperCase()}`,
      title: `${title_pre} ${title_suf}`,
      client,
      tagline: `Next-generation ${category.toLowerCase()} solution for the digital age.`,
      description: {
        overview,
        challenge,
        solution,
        impact
      },
      category,
      status,
      year: (2020 + (i % 5)).toString(),
      thumbnail: `/img/projects/project-${(i % 5) + 1}.png`,
      gallery: [],
      techStack: selectedTech,
      team: [
        { id: 'dev_1', name: 'Adam Jensen', role: 'Security Architect', avatar: '/img/avatars/1.jpg', contribution: 'Encryption core.' },
        { id: 'dev_2', name: 'Molly Millions', role: 'Interface Lead', avatar: '/img/avatars/2.jpg', contribution: 'UI Optimization.' },
        { id: 'dev_3', name: 'Case', role: 'Backend Engineer', avatar: '/img/avatars/3.jpg', contribution: 'Distributed systems.' }
      ],
      milestones: [
        { date: 'Jan 2024', title: 'Conceptualization', description: 'Brainstorming session and initial C4 architecture diagramming.', completed: true },
        { date: 'Mar 2024', title: 'MVP Development', description: 'Core features implemented with early tester feedback.', completed: true },
        { date: 'Jun 2024', title: 'Security Audit', description: 'Full penetration testing and vulnerability assessment.', completed: true },
        { date: 'Sep 2024', title: 'Public Launch', description: 'Available globally across all major regions.', completed: status === 'completed' }
      ],
      stats: {
        commits: 1200 + Math.floor(pseudoRandom(seed + 10) * 8000),
        hoursSpent: 500 + Math.floor(pseudoRandom(seed + 11) * 3000),
        performanceScore: 92 + Math.floor(pseudoRandom(seed + 12) * 8),
        uptime: '99.99%',
        users: `${10 + Math.floor(pseudoRandom(seed + 13) * 500)}k`
      },
      links: {
        live: 'https://mdkcraft.pl',
        github: 'https://github.com/mdkcraft',
        caseStudy: '#'
      },
      theme: {
        primary: `hsl(${Math.floor(pseudoRandom(seed + 14) * 360)}, 70%, 50%)`,
        secondary: `hsl(${Math.floor(pseudoRandom(seed + 15) * 360)}, 60%, 20%)`,
        accent: '#ffffff'
      }
    }
  })
}

// -----------------------------------------------------------------------------
// 5. MANUALLY REFINED PROJECTS (To ensure extreme quality for first items)
// -----------------------------------------------------------------------------

const FEATURED_PROJECTS: Project[] = [
    {
        id: "ARCHIVE_01_QUANTUM",
        title: "Quantum E-Commerce Backbone",
        client: "LuxCart Global",
        tagline: "Ultra-low latency commerce infrastructure for high-end fashion brands.",
        description: {
            overview: "A specialized headless commerce engine designed to handle the volatile traffic spikes of limited edition fashion drops. Built with a heavy focus on concurrency and data consistency.",
            challenge: "The client faced 30-second hang times during product launches, leading to massive user drop-offs and lost revenue during peak 15-minute windows.",
            solution: "We implemented a globally distributed transaction bridge using Rust and an edge-first caching layer that pre-calculates stock levels for millions of users.",
            impact: "Zero downtime during the 2024 Winter Collection drop, processing $2M in orders within the first 4 minutes of launch."
        },
        category: "E-commerce",
        status: "completed",
        year: "2024",
        thumbnail: "/img/projects/project-1.png",
        gallery: [],
        techStack: [
            { name: 'Rust', icon: Settings, category: 'backend' },
            { name: 'Next.js 15', icon: Box, category: 'frontend' },
            { name: 'Redis', icon: Layers, category: 'backend' },
            { name: 'GraphQL', icon: Share2, category: 'backend' },
            { name: 'AWS', icon: Network, category: 'cloud' }
        ],
        team: [
            { id: '1', name: 'Viktor Reznov', role: 'Lead Architect', avatar: '/img/avatars/1.jpg', contribution: 'Rust worker engine.' }
        ],
        milestones: [
            { date: 'Dec 2023', title: 'Kickoff', description: 'Initial requirements for peak load handling.', completed: true }
        ],
        stats: {
            commits: 4500,
            hoursSpent: 1800,
            performanceScore: 99,
            uptime: '100%',
            users: '2.5M'
        },
        links: { live: '#', github: '#' },
        theme: { primary: '#8b5cf6', secondary: '#1e1b4b', accent: '#fff' }
    },
    {
        id: "ARCHIVE_02_AETHER",
        title: "Aether Vision AI",
        client: "NeuralDynamics",
        tagline: "Real-time gesture recognition and environment mapping for medical professionals.",
        description: {
            overview: "An advanced computer vision platform that allows surgeons to interact with patient data using touchless gestures during operations.",
            challenge: "Detecting clinical gestures with 99.9% accuracy in variable operating room lighting conditions without introducing more than 10ms of input lag.",
            solution: "We developed a hybrid neural network that runs partially on the edge (GPU) and uses a custom optimization for hand-tracking keypoints.",
            impact: "Deployed in 15 hospitals, reducing average surgery time by 12% due to more efficient data retrieval by the surgical team."
        },
        category: "AI/ML",
        status: "in-progress",
        year: "2024",
        thumbnail: "/img/projects/project-2.png",
        gallery: [],
        techStack: [
            { name: 'Python', icon: Code2, category: 'backend' },
            { name: 'TensorFlow', icon: Cpu, category: 'backend' },
            { name: 'Three.js', icon: Box, category: 'frontend' },
            { name: 'Node.js', icon: Server, category: 'backend' }
        ],
        team: [
            { id: '1', name: 'Ava Lord', role: 'ML Engineer', avatar: '/img/avatars/2.jpg', contribution: 'Neural net optimization.' }
        ],
        milestones: [
            { date: 'Feb 2024', title: 'Beta V1', description: 'First successful surgery test.', completed: true }
        ],
        stats: {
            commits: 6200,
            hoursSpent: 2400,
            performanceScore: 94,
            uptime: '99.95%',
            users: '500+'
        },
        links: { live: '#', github: '#' },
        theme: { primary: '#0ea5e9', secondary: '#0c4a6e', accent: '#fff' }
    }
]

// -----------------------------------------------------------------------------
// 6. EXPORTED CONSTANTS
// -----------------------------------------------------------------------------

export const PROJECTS_DATA: Project[] = [
    ...FEATURED_PROJECTS,
    ...generateProjects(100)
]

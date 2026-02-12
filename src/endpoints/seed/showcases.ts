import type { Media, Showcase } from '@/payload-types'
import { Payload, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'
import {
    CHALLENGES,
    CLIENTS,
    IMPACTS,
    OVERVIEWS,
    SOLUTIONS,
    TECH_POOL,
    TITLES_PREFIX,
    TITLES_SUFFIX,
    pseudoRandom
} from '../../app/(app)/projectsArchive/data/projects'

export const seedShowcases = async ({
  payload,
  req,
  thumbnail,
}: {
  payload: Payload
  req: PayloadRequest
  thumbnail: Media
}): Promise<void> => {
  payload.logger.info(`— Seeding 50 showcases...`)

  const count = 50
  const usedSlugs = new Set<string>()
  const projects: RequiredDataFromCollectionSlug<'showcases'>[] = []

  for (let i = 0; i < count; i++) {
    let seed = (i + 1) * 777
    let title = ''
    let slug = ''
    
    // Generate unique title/slug
    while (true) {
      const title_pre = TITLES_PREFIX[Math.floor(pseudoRandom(seed + 1) * TITLES_PREFIX.length)]
      const title_suf = TITLES_SUFFIX[Math.floor(pseudoRandom(seed + 2) * TITLES_SUFFIX.length)]
      title = `${title_pre} ${title_suf}`
      slug = title.toLowerCase().replace(/ /g, '-')
      
      if (!usedSlugs.has(slug)) {
        usedSlugs.add(slug)
        break
      }
      seed += 13 // Re-roll with different seed if collision occurs
    }
    
    const client = CLIENTS[Math.floor(pseudoRandom(seed + 3) * CLIENTS.length)]
    const overview = OVERVIEWS[Math.floor(pseudoRandom(seed + 4) * OVERVIEWS.length)]
    const challenge = CHALLENGES[Math.floor(pseudoRandom(seed + 5) * CHALLENGES.length)]
    const solution = SOLUTIONS[Math.floor(pseudoRandom(seed + 6) * SOLUTIONS.length)]
    const impact = IMPACTS[Math.floor(pseudoRandom(seed + 7) * IMPACTS.length)]
    
    // Select 6 unique tech items
    const selectedTech: any[] = []
    const tempPool = [...TECH_POOL]
    for (let j = 0; j < 6; j++) {
      const idx = Math.floor(pseudoRandom(seed + j + 20) * tempPool.length)
      const tech = tempPool[idx]
      
      // Get icon name from component or string
      let iconName = 'Box' // Default fallback
      if (typeof tech.icon === 'string') {
        iconName = tech.icon
      } else if (tech.icon && (tech.icon as any).displayName) {
        iconName = (tech.icon as any).displayName
      } else if (tech.icon && (tech.icon as any).name) {
        iconName = (tech.icon as any).name
      }

      selectedTech.push({
        name: tech.name,
        icon: iconName,
        category: tech.category,
        description: tech.description,
      })
      tempPool.splice(idx, 1)
    }
    
    // Random status
    const statuses: Showcase['status'][] = ['completed', 'completed', 'completed', 'in-progress', 'maintenance']
    const status = statuses[Math.floor(pseudoRandom(seed + 8) * statuses.length)]
    
    // Random category
    const categories: Showcase['category'][] = ['E-commerce', 'FinTech', 'Healthcare', 'AI/ML', 'Blockchain', 'IoT', 'SaaS', 'Social']
    const category = categories[Math.floor(pseudoRandom(seed + 9) * categories.length)]

    projects.push({
      title,
      slug,
      client,
      tagline: `Next-generation ${category.toLowerCase()} solution for the digital age.`,
      year: (2020 + (i % 5)).toString(),
      category,
      status,
      description: {
        overview,
        challenge,
        solution,
        impact,
      },
      thumbnail: thumbnail.id,
      techStack: selectedTech,
      team: [
        { name: 'Adam Jensen', role: 'Security Architect', avatar: '/img/avatars/1.jpg', contribution: 'Encryption core.' },
        { name: 'Molly Millions', role: 'Interface Lead', avatar: '/img/avatars/2.jpg', contribution: 'UI Optimization.' },
        { name: 'Case', role: 'Backend Engineer', avatar: '/img/avatars/3.jpg', contribution: 'Distributed systems.' }
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
      features: [
        { title: 'Edge Performance', description: 'Sub-millisecond response times globally.' },
        { title: 'Zero Trust Security', description: 'Cryptographic identity verification for every request.' },
        { title: 'Real-time Analytics', description: 'Instant feedback loops for data-driven decisions.' }
      ],
      techDetails: {
        architecture: 'Microservices with service mesh',
        language: 'Rust / TypeScript',
        database: 'PostgreSQL / Redis',
        hosting: 'Vercel / AWS'
      },
      testimonial: {
        quote: `Implementing ${title} was a turning point for our digital strategy. The results speak for themselves.`,
        author: 'Sarah Chen',
        role: 'CTO at ' + client
      },
      theme: {
        primary: `#${Math.floor(pseudoRandom(seed + 14) * 16777215).toString(16).padStart(6, '0')}`,
      },
    })
  }

  await Promise.all(
    projects.map((project) =>
      payload.create({
        collection: 'showcases',
        data: project,
        req,
      }),
    ),
  )
}

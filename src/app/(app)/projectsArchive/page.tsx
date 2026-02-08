import { Media } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ArchiveHeader } from './components/ArchiveHeader'
import { ShowcaseArchiveClient } from './components/ShowcaseArchiveClient'
import { Project, ProjectCategory, Projectstatus } from './types/project'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // Cache for 10 minutes

export default async function ProjectsArchivePage() {
  const payload = await getPayload({ config: configPromise })
  
  const showcases = await payload.find({
    collection: 'showcases',
    limit: 6,
    depth: 1,
    sort: '-year',
  })

  // Map Payload data to Project interface
  const projects: Project[] = showcases.docs.map((doc: any): Project => {
    return {
      id: doc.id,
      title: doc.title,
      client: doc.client,
      tagline: doc.tagline,
      description: {
        overview: doc.description.overview,
        challenge: doc.description.challenge,
        solution: doc.description.solution,
        impact: doc.description.impact,
      },
      category: doc.category as ProjectCategory,
      status: doc.status as Projectstatus,
      year: doc.year,
      thumbnail: (doc.thumbnail as Media)?.url || '',
      gallery: (doc.gallery || []).map((g: any) => (g.image as Media)?.url).filter(Boolean) as string[],
      techStack: (doc.techStack || []).map((t: any) => ({
        name: t.name,
        icon: t.icon, // This will be a string (Lucide icon name)
        category: t.category,
        version: t.version,
        description: t.description,
      })),
      team: (doc.team || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        avatar: (m.avatar as Media)?.url || '',
        contribution: m.contribution,
      })),
      milestones: (doc.milestones || []).map((ms: any) => ({
        date: ms.date,
        title: ms.title,
        description: ms.description,
        completed: ms.completed,
      })),
      stats: {
        commits: doc.stats.commits,
        hoursSpent: doc.stats.hoursSpent,
        performanceScore: doc.stats.performanceScore,
        uptime: doc.stats.uptime,
        users: doc.stats.users,
      },
      links: {
        live: doc.links?.live,
        github: doc.links?.github,
        caseStudy: doc.links?.caseStudy,
      },
      theme: {
        primary: doc.theme.primary,
        secondary: doc.theme.secondary,
        accent: doc.theme.accent,
      },
      features: (doc.features || []).map((f: any) => ({
        title: f.title,
        description: f.description,
      })),
      techDetails: {
        architecture: doc.techDetails?.architecture,
        language: doc.techDetails?.language,
        database: doc.techDetails?.database,
        hosting: doc.techDetails?.hosting,
      },
      testimonial: {
        quote: doc.testimonial?.quote,
        author: doc.testimonial?.author,
        role: doc.testimonial?.role,
      },
      seo: {
        metaTitle: doc.seo?.metaTitle,
        metaDescription: doc.seo?.metaDescription,
      },
    }
  })

  return (
    <main className="relative min-h-screen text-white selection:bg-violet-500/30 bg-[#020408]">
      
      {/* 2. HEADER */}
      <ArchiveHeader />

      {/* 3. CLIENT CONTENT (Hero, Filters, Cards) */}
      <ShowcaseArchiveClient initialProjects={projects} totalDocs={showcases.totalDocs} />

    </main>
  )
}
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
  const projects: Project[] = showcases.docs.map((doc: unknown): Project => {
    const d = doc as any // Explicit cast for dynamic mapping
    return {
      id: d.id,
      title: d.title,
      client: d.client,
      tagline: d.tagline,
      description: {
        overview: d.description?.overview || '',
        challenge: d.description?.challenge || '',
        solution: d.description?.solution || '',
        impact: d.description?.impact || '',
      },
      category: d.category as ProjectCategory,
      status: d.status as Projectstatus,
      year: String(d.year || ''),
      thumbnail: (d.thumbnail as Media)?.url || '',
      gallery: (d.gallery || [])
        .map((g: any) => (g.image as Media)?.url)
        .filter(Boolean) as string[],
      techStack: (d.techStack || []).map((t: any) => ({
        name: t.name,
        icon: t.icon,
        category: t.category,
        version: t.version,
        description: t.description,
      })),
      team: (d.team || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        avatar: (m.avatar as Media)?.url || '',
        contribution: m.contribution,
      })),
      milestones: (d.milestones || []).map((ms: any) => ({
        date: ms.date,
        title: ms.title,
        description: ms.description,
        completed: ms.completed,
      })),
      stats: {
        commits: d.stats?.commits || 0,
        hoursSpent: d.stats?.hoursSpent || 0,
        performanceScore: d.stats?.performanceScore || 0,
        uptime: d.stats?.uptime,
        users: d.stats?.users,
      },
      links: {
        live: d.links?.live,
        github: d.links?.github,
        caseStudy: d.links?.caseStudy,
      },
      theme: {
        primary: d.theme?.primary || '#000',
        secondary: d.theme?.secondary,
        accent: d.theme?.accent,
      },
      features: (d.features || []).map((f: any) => ({
        title: f.title,
        description: f.description,
      })),
      techDetails: {
        architecture: d.techDetails?.architecture,
        language: d.techDetails?.language,
        database: d.techDetails?.database,
        hosting: d.techDetails?.hosting,
      },
      testimonial: {
        quote: d.testimonial?.quote,
        author: d.testimonial?.author,
        role: d.testimonial?.role,
      },
      seo: {
        metaTitle: d.seo?.metaTitle,
        metaDescription: d.seo?.metaDescription,
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

'use server'

import { Media, Showcase } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { Project, ProjectCategory, Projectstatus } from './types/project'

export async function getProjectsAction({
    page = 1,
    limit = 6,
    category = 'All'
}: {
    page?: number
    limit?: number
    category?: ProjectCategory | 'All'
}) {
    const payload = await getPayload({ config: configPromise })

    const where: Where = {}
    if (category !== 'All') {
        where.category = {
            equals: category
        }
    }

    const showcases = await payload.find({
        collection: 'showcases',
        limit,
        page,
        where,
        depth: 1,
        sort: '-year', // Sort by year descending
    })

    const projects: Project[] = showcases.docs.map((doc: Showcase): Project => {
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
            gallery: (doc.gallery || []).map((g) => (g.image as Media)?.url).filter(Boolean) as string[],
            techStack: (doc.techStack || []).map((t) => ({
                name: t.name,
                icon: t.icon,
                category: t.category,
                version: t.version ?? undefined,
                description: t.description ?? undefined,
            })),
            team: (doc.team || []).map((m) => ({
                id: m.id ?? '',
                name: m.name,
                role: m.role,
                avatar: m.avatar ?? '',
                contribution: m.contribution ?? '',
            })),
            milestones: (doc.milestones || []).map((ms) => ({
                date: ms.date,
                title: ms.title,
                description: ms.description ?? '',
                completed: !!ms.completed,
            })),
            stats: {
                commits: doc.stats.commits,
                hoursSpent: doc.stats.hoursSpent,
                performanceScore: doc.stats.performanceScore,
                uptime: doc.stats.uptime ?? undefined,
                users: doc.stats.users ?? undefined,
            },
            links: {
                live: doc.links?.live ?? undefined,
                github: doc.links?.github ?? undefined,
                caseStudy: doc.links?.caseStudy ?? undefined,
            },
            theme: {
                primary: doc.theme.primary,
                secondary: doc.theme.secondary ?? undefined,
                accent: doc.theme.accent ?? undefined,
            },
            features: (doc.features || []).map((f) => ({
                title: f.title,
                description: f.description,
            })),
            techDetails: {
                architecture: doc.techDetails?.architecture ?? undefined,
                language: doc.techDetails?.language ?? undefined,
                database: doc.techDetails?.database ?? undefined,
                hosting: doc.techDetails?.hosting ?? undefined,
            },
            testimonial: {
                quote: doc.testimonial?.quote ?? undefined,
                author: doc.testimonial?.author ?? undefined,
                role: doc.testimonial?.role ?? undefined,
            },
            seo: {
                metaTitle: doc.seo?.metaTitle ?? undefined,
                metaDescription: doc.seo?.metaDescription ?? undefined,
            },
        }
    })

    return {
        projects,
        hasNextPage: showcases.hasNextPage,
        nextPage: showcases.nextPage,
        totalDocs: showcases.totalDocs
    }

}

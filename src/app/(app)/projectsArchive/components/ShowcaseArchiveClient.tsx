'use client'

import { Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getProjectsAction } from '../actions'
import { Project, ProjectCategory } from '../types/project'
import { ArchiveHero } from './ArchiveHero'
import { FilterChip } from './FilterChip'
import { ProjectCard } from './ProjectCard'
import { ProjectCardSkeleton } from './ShowcaseSkeletons'

interface ShowcaseArchiveClientProps {
    initialProjects: Project[]
    totalDocs: number
}

const PROJECTS_PER_PAGE = 6

export const ShowcaseArchiveClient = ({ initialProjects, totalDocs }: ShowcaseArchiveClientProps) => {
    const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All')
    const [projects, setProjects] = useState<Project[]>(initialProjects)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [hasNextPage, setHasNextPage] = useState(totalDocs > initialProjects.length)
    
    const observerTarget = useRef<HTMLDivElement>(null)

    const loadMoreProjects = useCallback(async (category: ProjectCategory | 'All', nextPage: number) => {
        if (isLoading || !hasNextPage) return
        
        setIsLoading(true)
        try {
            const result = await getProjectsAction({
                page: nextPage,
                limit: PROJECTS_PER_PAGE,
                category
            })
            
            if (result.projects.length > 0) {
                setProjects(prev => [...prev, ...result.projects])
                setPage(nextPage)
                setHasNextPage(result.hasNextPage)
            } else {
                setHasNextPage(false)
            }
        } catch (error) {
            console.error('Error loading more projects:', error)
        } finally {
            setIsLoading(false)
        }
    }, [isLoading, hasNextPage])

    const handleCategoryChange = async (cat: ProjectCategory | 'All') => {
        if (cat === activeCategory) return
        
        setActiveCategory(cat)
        setIsLoading(true)
        setProjects([]) // Clear current projects for better feedback
        
        try {
            const result = await getProjectsAction({
                page: 1,
                limit: PROJECTS_PER_PAGE,
                category: cat
            })
            setProjects(result.projects)
            setPage(1)
            setHasNextPage(result.hasNextPage)
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
        } catch (error) {
            console.error('Error filtering projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isLoading) {
                    loadMoreProjects(activeCategory, page + 1)
                }
            },
            { threshold: 0.1 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [loadMoreProjects, activeCategory, page, hasNextPage, isLoading])

    // Categories for filter bar
    const categories: (ProjectCategory | 'All')[] = ['All', 'E-commerce', 'FinTech', 'AI/ML', 'Blockchain', 'SaaS', 'IoT']

    return (
        <>
            {/* 1. HERO SECTION */}
            <ArchiveHero projectCount={totalDocs} />

            {/* 2. FILTER BAR */}
            <div className="sticky top-[88%] z-50 py-3 pointer-events-none">
                <div className="px-6 md:px-10 mx-auto flex pointer-events-auto">
                    <div className="p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl flex overflow-x-auto overflow-y-hidden no-scrollbar gap-2 max-w-4xl shadow-2xl mx-auto items-center">
                        {categories.map((cat) => (
                            <FilterChip 
                                key={cat} 
                                label={cat} 
                                active={activeCategory === cat} 
                                onClick={() => handleCategoryChange(cat)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. PROJECT CARDS STACK */}
            <div className="relative z-10 pb-48">
                <AnimatePresence mode="popLayout">
                    {projects.length > 0 ? (
                        projects.map((project, index) => (
                            <motion.div 
                                key={project.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, delay: (index % PROJECTS_PER_PAGE) * 0.1 }}
                                className="relative"
                            >
                                <ProjectCard project={project} index={index} />
                            </motion.div>
                        ))
                    ) : isLoading ? (
                        // Show skeletons when switching categories
                        [1, 2, 3].map((i) => (
                            <motion.div
                                key={`skeleton-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                            >
                                <ProjectCardSkeleton />
                            </motion.div>
                        ))
                    ) : null}
                </AnimatePresence>
                
                {/* LOADING STATE & OBSERVER TARGET */}
                <div ref={observerTarget} className="min-h-[200px] flex flex-col items-center justify-center gap-6 py-20">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="size-8 text-violet-500" />
                            </motion.div>
                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-[0.3em] animate-pulse">
                                Accessing encrypted archive...
                            </span>
                        </div>
                    ) : !hasNextPage ? (
                        <div className="flex flex-col items-center gap-8 opacity-40">
                             <div className="h-px w-32 bg-linear-to-r from-transparent via-neutral-500 to-transparent" />
                             <p className="text-neutral-500 font-mono text-sm tracking-[0.5em] uppercase">-- END OF ARCHIVE --</p>
                             <div className="h-px w-32 bg-linear-to-r from-transparent via-neutral-500 to-transparent" />
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}

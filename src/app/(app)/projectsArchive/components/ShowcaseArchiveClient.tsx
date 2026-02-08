'use client'

import { useMemo, useState } from 'react'
import { Project, ProjectCategory } from '../types/project'
import { ArchiveHero } from './ArchiveHero'
import { FilterChip } from './FilterChip'
import { ProjectCard } from './ProjectCard'

interface ShowcaseArchiveClientProps {
    projects: Project[]
}

export const ShowcaseArchiveClient = ({ projects }: ShowcaseArchiveClientProps) => {
    const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All')
    
    const filteredProjects = useMemo(() => {
        if (activeCategory === 'All') return projects
        return projects.filter(p => p.category === activeCategory)
    }, [activeCategory, projects])

    // Categories for filter bar
    const categories: (ProjectCategory | 'All')[] = ['All', 'E-commerce', 'FinTech', 'AI/ML', 'Blockchain', 'SaaS', 'IoT']

    return (
        <>
            {/* 1. HERO SECTION */}
            <ArchiveHero projectCount={projects.length} />

            {/* 2. FILTER BAR */}
            <div className="sticky top-[88%]  z-40 py-3 pointer-events-none r">
                <div className="px-10 mx-auto flex  pointer-events-auto">
                    <div className="p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-md flex overflow-auto  gap-2 max-w-4xl shadow-2xl  mx-auto ">
                        {categories.map((cat) => (
                            <FilterChip 
                                key={cat} 
                                label={cat} 
                                active={activeCategory === cat} 
                                onClick={() => {
                                    setActiveCategory(cat)
                                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. PROJECT CARDS STACK */}
            <div className="relative z-10 pb-48">
                {filteredProjects.map((project, index) => (
                    <div key={project.id} className="relative h-dvh ">
                        <ProjectCard project={project} index={index} />
                    </div>
                ))}
                
                {/* LOAD MORE TRIGGER */}
                <div className="h-48 flex items-center justify-center">
                    <p className="text-neutral-500 font-mono text-sm">-- END OF ARCHIVE --</p>
                </div>
            </div>
        </>
    )
}

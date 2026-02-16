'use client'

import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function SearchBar({ defaultQuery }: { defaultQuery?: string }) {
  const [query, setQuery] = useState(defaultQuery || '')

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/10">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SZUKAJ W PLIKACH..."
          className="w-full bg-white/5 border-none h-11 pl-12 pr-4 rounded-2xl text-xs font-mono uppercase tracking-widest focus:ring-1 focus:ring-primary/50 transition-all outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              // Navigate programmatically on Enter
              window.location.href = query.trim()
                ? `/files?q=${encodeURIComponent(query.trim())}`
                : '/files'
            }
          }}
        />
      </div>
      <div className="space-x-2 w-max flex flex-row flex-nowrap">
        <Link href={query.trim() ? `/files?q=${encodeURIComponent(query.trim())}` : '/files'}>
          <Button
            type="button"
            className="h-11 px-6 md:w-auto rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Szukaj Zasobów <Search size={16} />
          </Button>
        </Link>
        {defaultQuery && (
          <Link href="/files">
            <Button
              type="button"
              variant={'destructive'}
              className="h-11 px-6 md:w-auto rounded-xl border border-red-500/20 font-black text-[10px] uppercase tracking-widest"
            >
              Wyczyść <X size={16} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

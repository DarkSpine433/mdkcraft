import { ClientFile } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import configPromise from '@payload-config'
import {
  Download,
  FileCode,
  FileText,
  FolderOpenDot,
  Image as ImageIcon,
  MoreVertical,
  Search,
} from 'lucide-react'
import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'

export default async function FilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login?redirect=/files')
  }

  const where: any = {
    client: {
      equals: user.id,
    },
  }

  if (q) {
    where.or = [
      {
        filename: {
          contains: q,
        },
      },
      {
        description: {
          contains: q,
        },
      },
    ]
  }

  const filesResult = await payload.find({
    collection: 'client-files',
    where,
    sort: '-createdAt',
  })

  const files = filesResult.docs as ClientFile[]

  const getFileIcon = (mime: string) => {
    if (mime?.includes('image')) return <ImageIcon size={18} className="text-purple-400" />
    if (mime?.includes('pdf')) return <FileText size={18} className="text-red-400" />
    if (mime?.includes('javascript') || mime?.includes('json'))
      return <FileCode size={18} className="text-yellow-400" />
    return <FileText size={18} className="text-blue-400" />
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <FolderOpenDot className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Repozytorium Plików</h1>
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
              Bezpieczny dostęp do dokumentacji i zasobów projektowych.
            </p>
          </div>
        </div>
      </header>

      {/* SEARCH BAR */}
      <form className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/10">
        <div className="relative w-full md:w-96">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/10">
        <div className="relative w-full ">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="SZUKAJ_W_PLIKACH..."
            placeholder="SZUKAJ W PLIKACH..."
            className="w-full bg-white/5 border-none h-11 pl-12 pr-4 rounded-2xl text-xs font-mono uppercase tracking-widest focus:ring-1 focus:ring-primary/50 transition-all outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-11 px-6 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          Szukaj_Zasobów
        </button>
      </form>

      <section className="rounded-[30px] md:rounded-[40px] bg-white/5 border border-white/10 overflow-hidden backdrop-blur-3xl">
        {files.length === 0 ? (
          <div className="px-8 py-20 text-center">
            <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
              Brak dostępnych plików w Twoim repozytorium.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-8 py-5 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">
                      Nazwa_Pliku
                    </th>
                    <th className="px-8 py-5 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">
                      Rozmiar
                    </th>
                    <th className="px-8 py-5 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">
                      Data_Przesłania
                    </th>
                    <th className="px-8 py-5 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] text-right">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {files.map((file: ClientFile) => (
                    <tr key={file.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            {getFileIcon(file.mimeType || '')}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                              {file.filename}
                            </p>
                            <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest">
                              {file.mimeType?.split('/')[1] || 'PLIK'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-mono text-neutral-400">
                          {formatSize(file.filesize || 0)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-mono text-neutral-400">
                          {new Date(file.createdAt).toLocaleDateString('pl-PL')}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={file.url || ''}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white/5 hover:bg-primary/10 text-neutral-400 hover:text-primary rounded-lg transition-all"
                          >
                            <Download size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-white/5">
              {files.map((file: ClientFile) => (
                <div key={file.id} className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                      {getFileIcon(file.mimeType || '')}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-white uppercase tracking-tight truncate">
                        {file.filename}
                      </p>
                      <div className="flex justify-between text-[9px] text-neutral-500 font-mono uppercase tracking-widest mt-1">
                        <span>{file.mimeType?.split('/')[1] || 'PLIK'}</span>
                        <span>{formatSize(file.filesize || 0)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] font-mono text-neutral-600">
                      {new Date(file.createdAt).toLocaleDateString('pl-PL')}
                    </span>
                    <div className="flex gap-2">
                      <a
                        href={file.url || ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 px-4 bg-white/5 rounded-lg flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                      >
                        <Download size={14} /> Pobierz
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <section className="rounded-[40px] bg-white/5 border border-white/10 overflow-hidden backdrop-blur-3xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-5 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">
                Nazwa Pliku
              </th>
              <th className="px-8 py-5 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] hidden md:table-cell">
                Rozmiar
              </th>
              <th className="px-8 py-5 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] hidden md:table-cell">
                Data Przesłania
              </th>
              <th className="px-8 py-5 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em] text-right">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {files.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
                    Brak dostępnych plików w Twoim repozytorium.
                  </p>
                </td>
              </tr>
            ) : (
              files.map((file: ClientFile) => (
                <tr key={file.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        {getFileIcon(file.mimeType || '')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                          {file.filename}
                        </p>
                        <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest">
                          {file.mimeType?.split('/')[1] || 'PLIK'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <span className="text-xs font-mono text-neutral-400">
                      {formatSize(file.filesize || 0)}
                    </span>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <span className="text-xs font-mono text-neutral-400">
                      {new Date(file.createdAt).toLocaleDateString('pl-PL')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={file.url || ''}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-white/5 hover:bg-primary/10 text-neutral-400 hover:text-primary rounded-lg transition-all"
                      >
                        <Download size={16} />
                      </a>
                      <button className="p-2.5 bg-white/5 hover:bg-white/10 text-neutral-400 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Zarządzaj swoimi plikami w MDKcraft.',
  openGraph: mergeOpenGraph({
    title: 'Repozytorium Plików',
    url: '/files',
  }),
  title: 'Pliki',
}

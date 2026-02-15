'use client'

import { anonymizeUserData, exportUserData } from '@/app/actions/dashboard'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

export const PrivacyActions = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [isAnonymizing, setIsAnonymizing] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await exportUserData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mdkcraft-data-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Eksport_Zakończony', {
        description: 'Twoje dane zostały przygotowane i pobrane.',
      })
    } catch (error) {
      toast.error('Błąd Eksportu', {
        description: 'Nie udało się wygenerować pliku danych.',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleAnonymize = async () => {
    setIsAnonymizing(true)
    try {
      await anonymizeUserData()
      toast.success('Dane_Zanonimizowane', {
        description: 'Twoje dane osobowe zostały usunięte z systemu.',
      })
      window.location.reload()
    } catch (error) {
      toast.error('Błąd Operacji', {
        description: 'Wystąpił problem podczas anonimizacji danych.',
      })
    } finally {
      setIsAnonymizing(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5 relative z-10">
      <Button
        variant="outline"
        onClick={handleExport}
        disabled={isExporting}
        className="h-11 px-8 bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest"
      >
        {isExporting ? 'Przygotowywanie...' : 'Eksportuj_Dane (JSON)'}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isAnonymizing}
            className="h-11 px-8 bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-500 rounded-xl font-bold transition-all text-[10px] uppercase tracking-widest"
          >
            {isAnonymizing ? 'Procesowanie...' : 'Usuń_Prywatne_Informacje'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#050507] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="uppercase font-black tracking-tighter">
              Potwierdź_Anonimizację
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-400 font-mono text-xs">
              Ta operacja zastąpi Twoje imię, nazwisko i dane kontaktowe losowymi ciągami znaków.
              Twoje konto pozostanie aktywne, ale Twoja tożsamość zostanie ukryta. Operacja jest
              nieodwracalna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Anuluj
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAnonymize}
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              Potwierdzam_Usunięcie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

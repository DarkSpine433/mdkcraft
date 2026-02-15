'use client'

import { updateUserSettings } from '@/app/actions/dashboard'
import { FormItem } from '@/components/forms/FormItem'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { Mail, Palette } from 'lucide-react'
import React, { useCallback, useEffect, useOptimistic, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type SettingsData = {
  newsletter: boolean
  marketing: boolean
  fontSize: 'small' | 'medium' | 'large'
  layoutDensity: 'compact' | 'comfortable' | 'spacious'
  animationSpeed: 'fast' | 'normal' | 'relaxed'
  glassIntensity: 'low' | 'medium' | 'high'
}

type SettingsFormData = {
  settings: SettingsData
}

export const SettingsForm: React.FC = () => {
  const { setUser, user } = useAuth()
  const [isPending, startTransition] = useTransition()

  const initialSettings: SettingsData = {
    newsletter: user?.settings?.newsletter ?? false,
    marketing: user?.settings?.marketing ?? false,
    fontSize: (user?.settings?.fontSize as SettingsData['fontSize']) ?? 'medium',
    layoutDensity: (user?.settings?.layoutDensity as SettingsData['layoutDensity']) ?? 'comfortable',
    animationSpeed:
      (user?.settings?.animationSpeed as SettingsData['animationSpeed']) ?? 'normal',
    glassIntensity:
      (user?.settings?.glassIntensity as SettingsData['glassIntensity']) ?? 'medium',
  }

  const [optimisticSettings, setOptimisticSettings] = useOptimistic(
    initialSettings,
    (state, newSettings: Partial<SettingsData>) => ({
      ...state,
      ...newSettings,
    }),
  )

  const { control, reset, handleSubmit } = useForm<SettingsFormData>({
    defaultValues: { settings: initialSettings },
  })

  useEffect(() => {
    if (user) {
      reset({ settings: initialSettings })
    }
  }, [user, reset])

  const onSave = useCallback(
    async (data: SettingsFormData) => {
      try {
        const updatedUser = await updateUserSettings(data)
        setUser(updatedUser as User)
        toast.success('System_Zsynchronizowany', {
          description: 'Ustawienia zostały pomyślnie zapisane w bazie.',
          id: 'settings-save',
        })
      } catch (error) {
        toast.error('Błąd_Krytyczny', {
          description: 'Nie udało się zapisać ustawień. Reverting...',
        })
        console.error(error)
        // Reset form to actual user data
        if (user) reset({ settings: initialSettings })
      }
    },
    [setUser, user, reset],
  )

  const handleFieldChange =
    (name: keyof SettingsData, onChange: (val: any) => void) => (value: any) => {
      onChange(value)
      startTransition(async () => {
        setOptimisticSettings({ [name]: value })
        await handleSubmit(onSave)()
      })
    }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-12 animate-in fade-in duration-700">
      {/* SECTION 1: PREFERENCES */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter uppercase">Interfejs_Systemu</h2>
            <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
              Personalizacja wyglądu i czytelności
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-(--item-gap,2rem) max-w-2xl">
          <FormItem>
            <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2 block">
              Rozmiar_Tekstu
            </Label>
            <Controller
              name="settings.fontSize"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={handleFieldChange('fontSize', field.onChange)}
                  value={optimisticSettings.fontSize}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono">
                    <SelectValue placeholder="Wybierz rozmiar" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0c] border-white/10">
                    <SelectItem value="small" className="text-white hover:bg-white/5 font-mono">
                      MINIMALIST_SMALL
                    </SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-white/5 font-mono">
                      STANDARD_TYPE
                    </SelectItem>
                    <SelectItem value="large" className="text-white hover:bg-white/5 font-mono">
                      ACCESSIBLE_LARGE
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>

          <FormItem>
            <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2 block">
              Zagęszczenie_Interfejsu
            </Label>
            <Controller
              name="settings.layoutDensity"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={handleFieldChange('layoutDensity', field.onChange)}
                  value={optimisticSettings.layoutDensity}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono">
                    <SelectValue placeholder="Wybierz gęstość" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0c] border-white/10">
                    <SelectItem value="compact" className="text-white hover:bg-white/5 font-mono">
                      COMPACT_GRID
                    </SelectItem>
                    <SelectItem
                      value="comfortable"
                      className="text-white hover:bg-white/5 font-mono"
                    >
                      BALANCED_UI
                    </SelectItem>
                    <SelectItem value="spacious" className="text-white hover:bg-white/5 font-mono">
                      SPACIOUS_FLOW
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>

          <FormItem>
            <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2 block">
              Szybkość_Animacji
            </Label>
            <Controller
              name="settings.animationSpeed"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={handleFieldChange('animationSpeed', field.onChange)}
                  value={optimisticSettings.animationSpeed}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono">
                    <SelectValue placeholder="Wybierz szybkość" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0c] border-white/10">
                    <SelectItem value="fast" className="text-white hover:bg-white/5 font-mono">
                      FAST_RESPONSE
                    </SelectItem>
                    <SelectItem value="normal" className="text-white hover:bg-white/5 font-mono">
                      SYSTEM_DEFAULT
                    </SelectItem>
                    <SelectItem value="relaxed" className="text-white hover:bg-white/5 font-mono">
                      RELAXED_MOTION
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>

          <FormItem>
            <Label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2 block">
              Efekt_Glassmorfizmu
            </Label>
            <Controller
              name="settings.glassIntensity"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={handleFieldChange('glassIntensity', field.onChange)}
                  value={optimisticSettings.glassIntensity}
                  disabled={isPending}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-primary/50 transition-all font-mono">
                    <SelectValue placeholder="Wybierz intensywność" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0c] border-white/10">
                    <SelectItem value="low" className="text-white hover:bg-white/5 font-mono">
                      MINIMAL_GLASS
                    </SelectItem>
                    <SelectItem value="medium" className="text-white hover:bg-white/5 font-mono">
                      FROSTED_GLASS
                    </SelectItem>
                    <SelectItem value="high" className="text-white hover:bg-white/5 font-mono">
                      CRYSTAL_CLEAR
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>
        </div>
      </section>
      {/* SECTION 2: COMMUNICATION */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter uppercase">Komunikacja</h2>
            <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
              Zgody i powiadomienia e-mail
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-6 backdrop-blur-xl rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
            <Controller
              name="settings.newsletter"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="newsletter"
                  checked={optimisticSettings.newsletter}
                  disabled={isPending}
                  onCheckedChange={handleFieldChange('newsletter', field.onChange)}
                  className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              )}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="newsletter"
                className="text-sm font-bold uppercase tracking-tight cursor-pointer"
              >
                Subskrypcja Newslettera
              </label>
              <p className="text-[11px] text-neutral-500 font-mono leading-relaxed max-w-sm">
                Otrzymuj najnowsze raporty o projektach, aktualizacje systemu i ekskluzywne wglądy w
                branżę IT.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
            <Controller
              name="settings.marketing"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="marketing"
                  checked={optimisticSettings.marketing}
                  disabled={isPending}
                  onCheckedChange={handleFieldChange('marketing', field.onChange)}
                  className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              )}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="marketing"
                className="text-sm font-bold uppercase tracking-tight cursor-pointer"
              >
                Zgody Marketingowe
              </label>
              <p className="text-[11px] text-neutral-500 font-mono leading-relaxed max-w-sm">
                Pozwól nam informować Cię o nowych ofertach specjalnych i spersonalizowanych
                usługach deweloperskich.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isPending && (
        <div className="flex items-center gap-3 text-primary animate-pulse">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">
            Synchronizacja_Z_Bazą...
          </span>
        </div>
      )}
    </form>
  )
}

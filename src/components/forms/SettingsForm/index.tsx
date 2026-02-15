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
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type SettingsFormData = {
  settings: {
    newsletter: boolean
    marketing: boolean
    fontSize: 'small' | 'medium' | 'large'
    layoutDensity: 'compact' | 'comfortable' | 'spacious'
    animationSpeed: 'fast' | 'normal' | 'relaxed'
    glassIntensity: 'low' | 'medium' | 'high'
  }
}

export const SettingsForm: React.FC = () => {
  const { setUser, user } = useAuth()
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsFormData>()

  useEffect(() => {
    if (user) {
      const u = user as User
      reset({
        settings: {
          newsletter: u.settings?.newsletter ?? false,
          marketing: u.settings?.marketing ?? false,
          fontSize: (u.settings?.fontSize as SettingsFormData['settings']['fontSize']) ?? 'medium',
          layoutDensity:
            (u.settings?.layoutDensity as SettingsFormData['settings']['layoutDensity']) ??
            'comfortable',
          animationSpeed:
            (u.settings?.animationSpeed as SettingsFormData['settings']['animationSpeed']) ??
            'normal',
          glassIntensity:
            (u.settings?.glassIntensity as SettingsFormData['settings']['glassIntensity']) ??
            'medium',
        },
      })
    }
  }, [user, reset])

  const onSave = useCallback(
    async (data: SettingsFormData) => {
      try {
        const updatedUser = await updateUserSettings(data)
        setUser(updatedUser as User)
        toast.success('Ustawienia zostały zaktualizowane.', {
          id: 'settings-save',
        })
      } catch (error) {
        toast.error('Błąd podczas zapisywania ustawień.')
        console.error(error)
      }
    },
    [setUser],
  )

  const handleFieldChange =
    (onChange: (val: string | boolean) => void) => (value: string | boolean) => {
      onChange(value)
      handleSubmit(onSave)()
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
                  onValueChange={handleFieldChange(field.onChange)}
                  value={field.value}
                  disabled={isSubmitting}
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
                  onValueChange={handleFieldChange(field.onChange)}
                  value={field.value}
                  disabled={isSubmitting}
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
                  onValueChange={handleFieldChange(field.onChange)}
                  value={field.value}
                  disabled={isSubmitting}
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
                  onValueChange={handleFieldChange(field.onChange)}
                  value={field.value}
                  disabled={isSubmitting}
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
          <div className="flex items-start space-x-4 p-(--card-padding,1.5rem) backdrop-blur-(--glass-blur,16px) rounded-2xl bg-(--card-bg,rgba(255,255,255,0.03)) border border-white/10 hover:border-primary/30 transition-all duration-(--animation-duration,0.5s) ease-(--animation-easing,ease-in-out)">
            <Controller
              name="settings.newsletter"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="newsletter"
                  checked={field.value}
                  disabled={isSubmitting}
                  onCheckedChange={handleFieldChange(field.onChange)}
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
                  checked={field.value}
                  disabled={isSubmitting}
                  onCheckedChange={handleFieldChange(field.onChange)}
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

      {isSubmitting && (
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

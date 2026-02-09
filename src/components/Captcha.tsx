'use client'

import {
  generateImageChallenge,
  generateMathChallenge,
  verifyCaptcha,
} from '@/app/actions/verifyCaptcha'
import { Check, RefreshCw, Shield } from 'lucide-react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

type CaptchaMode = 'slider' | 'image' | 'math' | 'auto'

interface ImageChallenge {
  challengeId: string
  category: string
  label: string
  imageCount: number
  images: { id: number; url: string; thumbnail: string }[]
}

interface MathChallenge {
  challengeId: string
  question: string
  a: number
  b: number
  operation: string
}

export const AdvancedCaptcha = ({
  onVerify,
  onError,
  mode = 'auto',
}: {
  onVerify: (token: string, trustScore: number) => void
  onError?: (err: string) => void
  mode?: CaptchaMode
}) => {
  const [currentMode, setCurrentMode] = useState<'slider' | 'image' | 'math'>('slider')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [trustScore, setTrustScore] = useState<number>(0)
  const [attemptCount, setAttemptCount] = useState(0)

  // Slider state
  const trajectory = useRef<{ x: number; y: number; t: number; pressure?: number }[]>([])
  const x = useMotionValue(0)
  const opacity = useTransform(x, [0, 200, 240], [1, 0.5, 0])
  const dragProgress = useTransform(x, [0, 240], ['0%', '100%'])

  // Image challenge state
  const [imageChallenge, setImageChallenge] = useState<ImageChallenge | null>(null)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [clickPattern, setClickPattern] = useState<{ index: number; timestamp: number }[]>([])
  const [imageChallengeStartTime, setImageChallengeStartTime] = useState<number>(0)

  // Math challenge state
  const [mathChallenge, setMathChallenge] = useState<MathChallenge | null>(null)
  const [mathAnswer, setMathAnswer] = useState<string>('')

  // Device fingerprint - only initialize on client side
  const [deviceData, setDeviceData] = useState(() => {
    if (typeof window === 'undefined') {
      // Server-side default values
      return {
        webdriver: false,
        screenRes: '1920x1080',
        plugins: 0,
        touchPoints: 0,
        platform: 'unknown',
        userAgent: 'unknown',
        languages: [],
        timezone: 'UTC',
        cookieEnabled: false,
        doNotTrack: null,
      }
    }

    // Client-side actual values
    return {
      webdriver: navigator.webdriver || false,
      screenRes: `${window.screen.width}x${window.screen.height}`,
      plugins: navigator.plugins?.length || 0,
      touchPoints: navigator.maxTouchPoints || 0,
      platform: navigator.platform || 'unknown',
      userAgent: navigator.userAgent || 'unknown',
      languages: navigator.languages ? Array.from(navigator.languages) : [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled || false,
      doNotTrack: navigator.doNotTrack || null,
    }
  })

  // Update device data on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDeviceData({
        webdriver: navigator.webdriver || false,
        screenRes: `${window.screen.width}x${window.screen.height}`,
        plugins: navigator.plugins?.length || 0,
        touchPoints: navigator.maxTouchPoints || 0,
        platform: navigator.platform || 'unknown',
        userAgent: navigator.userAgent || 'unknown',
        languages: navigator.languages ? Array.from(navigator.languages) : [],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled || false,
        doNotTrack: navigator.doNotTrack || null,
      })
    }
  }, [])

  // Timing
  const pageLoadTime = useRef(typeof window !== 'undefined' ? Date.now() : 0)
  const interactionStartTime = useRef<number>(0)

  // Honeypot
  const [honeypot, setHoneypot] = useState('')

  // Inicjalizacja trybu automatycznego
  useEffect(() => {
    if (mode === 'auto') {
      // Większa trudność przy kolejnych próbach
      if (attemptCount === 0) {
        setCurrentMode('slider')
      } else if (attemptCount === 1) {
        setCurrentMode('math')
      } else {
        setCurrentMode('image')
      }
    } else {
      setCurrentMode(mode)
    }
  }, [mode, attemptCount])

  // Inicjalizacja wyzwań
  useEffect(() => {
    if (currentMode === 'image' && !imageChallenge) {
      loadImageChallenge()
    } else if (currentMode === 'math' && !mathChallenge) {
      loadMathChallenge()
    }
  }, [currentMode])

  const loadImageChallenge = async () => {
    try {
      const challenge = await generateImageChallenge()
      setImageChallenge(challenge)
      setImageChallengeStartTime(Date.now())
      setSelectedImages([])
      setClickPattern([])
    } catch (error) {
      console.error('Error loading image challenge:', error)
      onError?.('Nie udało się załadować wyzwania')
    }
  }

  const loadMathChallenge = async () => {
    try {
      const challenge = await generateMathChallenge()
      setMathChallenge(challenge)
      setMathAnswer('')
    } catch (error) {
      console.error('Error loading math challenge:', error)
      onError?.('Nie udało się załadować wyzwania')
    }
  }

  const recordMovement = useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    if (!interactionStartTime.current) {
      interactionStartTime.current = Date.now()
    }

    const pos = 'touches' in e ? e.touches[0] : e
    const pressure = 'pressure' in pos ? pos.pressure : undefined

    trajectory.current.push({
      x: pos.clientX,
      y: pos.clientY,
      t: Date.now(),
      pressure,
    })
  }, [])

  const handleSliderDragEnd = async () => {
    const finalX = x.get()

    if (finalX < 230) {
      x.set(0)
      trajectory.current = []
      return
    }

    await verifyChallenge({
      trajectory: trajectory.current,
    })
  }

  const handleImageClick = (imageIndex: number) => {
    if (!interactionStartTime.current) {
      interactionStartTime.current = Date.now()
    }

    setClickPattern((prev) => [...prev, { index: imageIndex, timestamp: Date.now() }])

    setSelectedImages((prev) => {
      if (prev.includes(imageIndex)) {
        return prev.filter((i) => i !== imageIndex)
      } else {
        return [...prev, imageIndex]
      }
    })
  }

  const handleImageSubmit = async () => {
    if (!imageChallenge || selectedImages.length === 0) {
      onError?.('Wybierz przynajmniej jeden obraz')
      return
    }

    await verifyChallenge({
      imageChallenge: {
        selectedImages,
        timeSpent: Date.now() - imageChallengeStartTime,
        clickPattern,
      },
      challengeId: imageChallenge.challengeId,
    })
  }

  const handleMathSubmit = async () => {
    if (!mathChallenge || mathAnswer === '') {
      onError?.('Wprowadź odpowiedź')
      return
    }

    await verifyChallenge({
      mathAnswer: parseInt(mathAnswer),
      mathChallengeId: mathChallenge.challengeId,
    })
  }

  const verifyChallenge = async (challengeData: any) => {
    setIsVerifying(true)

    try {
      const result = await verifyCaptcha({
        ...challengeData,
        deviceData,
        honeypot,
        pageLoadTime: pageLoadTime.current,
        interactionStartTime: interactionStartTime.current || Date.now(),
      })

      if (result.verified && result.token) {
        setIsVerified(true)
        setTrustScore(result.trustScore || 100)
        onVerify(result.token, result.trustScore || 100)
      } else {
        // Niepowodzenie - zwiększ trudność
        setAttemptCount((prev) => prev + 1)
        x.set(0)
        trajectory.current = []
        setIsVerifying(false)

        // Załaduj nowe wyzwanie
        if (currentMode === 'image') {
          loadImageChallenge()
        } else if (currentMode === 'math') {
          loadMathChallenge()
        }

        onError?.(result.error || 'Weryfikacja nieudana. Spróbuj ponownie.')
      }
    } catch (error) {
      setIsVerifying(false)
      onError?.('Błąd weryfikacji')
    }
  }

  const handleRefresh = () => {
    if (currentMode === 'image') {
      loadImageChallenge()
    } else if (currentMode === 'math') {
      loadMathChallenge()
    }
  }

  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 text-green-400 font-medium p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/30 shadow-lg shadow-green-500/10"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30">
          <Check className="w-5 h-5 text-green-400" strokeWidth={3} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-white">Zweryfikowano pomyślnie</div>
          <div className="text-xs text-green-400/80">
            Poziom zaufania: {trustScore}% • Bezpieczne połączenie
          </div>
        </div>
        <Shield className="w-5 h-5 text-green-400/60" />
      </motion.div>
    )
  }

  return (
    <div className="space-y-4 p-5 bg-gradient-to-br from-black/60 to-black/40 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center text-xs text-neutral-400 uppercase tracking-wider font-bold">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span>Weryfikacja bezpieczeństwa</span>
        </div>
        {attemptCount > 0 && <span className="text-orange-400">Próba {attemptCount + 1}</span>}
      </div>

      {/* Honeypot (ukryte pole dla botów) */}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px]"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Slider Mode */}
      {currentMode === 'slider' && (
        <div className="space-y-3">
          <div className="text-sm text-neutral-300 font-medium">
            Przesuń suwak, aby potwierdzić, że jesteś człowiekiem
          </div>

          <div className="relative h-16 bg-white/5 rounded-xl border border-white/5 overflow-hidden">
            <motion.div
              style={{ width: dragProgress }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/20 to-purple-600/20 border-r border-primary/50"
            />

            <div className="absolute right-2 inset-y-2 w-12 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center">
              <Check className="w-4 h-4 text-white/20" />
            </div>

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 245 }}
              dragElastic={0.1}
              style={{ x }}
              onDrag={recordMovement}
              onDragEnd={handleSliderDragEnd}
              whileDrag={{ scale: 1.05 }}
              className="absolute left-1 top-1 bottom-1 w-14 bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg shadow-primary/30 z-10 border border-white/10"
            >
              {isVerifying ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-6 h-6 text-white drop-shadow-lg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              )}
            </motion.div>

            <motion.span
              style={{ opacity }}
              className="absolute inset-0 flex items-center justify-center text-sm text-white/40 pointer-events-none font-medium"
            >
              Przesuń w prawo →
            </motion.span>
          </div>
        </div>
      )}

      {/* Image Challenge Mode */}
      {currentMode === 'image' && imageChallenge && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-300 font-medium">
              Wybierz wszystkie obrazki zawierające:{' '}
              <span className="text-primary font-bold">{imageChallenge.label}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Odśwież wyzwanie"
            >
              <RefreshCw className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: imageChallenge.imageCount }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleImageClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                  ${
                    selectedImages.includes(index)
                      ? 'border-primary shadow-lg shadow-primary/30'
                      : 'border-white/10 hover:border-white/20'
                  }
                `}
              >
                {/* Symulacja obrazka - w produkcji użyj prawdziwych obrazków */}
                <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-neutral-600 text-xs font-mono">
                  {imageChallenge.category}-{index}
                </div>

                {selectedImages.includes(index) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleImageSubmit}
            disabled={isVerifying || selectedImages.length === 0}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
              ${
                isVerifying || selectedImages.length === 0
                  ? 'bg-neutral-700 cursor-not-allowed opacity-50'
                  : 'bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20'
              }
            `}
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Weryfikacja...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Potwierdź ({selectedImages.length} wybrane)
              </>
            )}
          </button>
        </div>
      )}

      {/* Math Challenge Mode */}
      {currentMode === 'math' && mathChallenge && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-300 font-medium">
              Rozwiąż proste równanie matematyczne
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Nowe równanie"
            >
              <RefreshCw className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-4 font-mono">
                {mathChallenge.question}
              </div>
              <input
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMathSubmit()}
                className="w-full max-w-[200px] px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-center text-xl font-bold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="?"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={handleMathSubmit}
            disabled={isVerifying || mathAnswer === ''}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
              ${
                isVerifying || mathAnswer === ''
                  ? 'bg-neutral-700 cursor-not-allowed opacity-50'
                  : 'bg-primary hover:bg-primary/80 shadow-lg shadow-primary/20'
              }
            `}
          >
            {isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Weryfikacja...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Sprawdź odpowiedź
              </>
            )}
          </button>
        </div>
      )}

      {/* Security Info */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 pt-2 border-t border-white/5">
        <Shield className="w-3 h-3" />
        <span>Twoje dane są chronione i szyfrowane</span>
      </div>
    </div>
  )
}

/**
 * Hook for using Advanced Captcha
 */
export const useAdvancedCaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const [trustScore, setTrustScore] = useState<number>(0)

  const handleVerify = useCallback((token: string, score: number) => {
    setCaptchaToken(token)
    setTrustScore(score)
    setCaptchaError(null)
  }, [])

  const handleError = useCallback((error: string) => {
    setCaptchaError(error)
    setCaptchaToken(null)
    setTrustScore(0)
  }, [])

  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null)
    setCaptchaError(null)
    setTrustScore(0)
  }, [])

  return {
    captchaToken,
    captchaError,
    trustScore,
    isVerified: !!captchaToken,
    handleVerify,
    handleError,
    resetCaptcha,
  }
}

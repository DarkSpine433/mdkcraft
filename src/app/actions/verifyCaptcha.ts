'use server'

import crypto from 'crypto'

interface TrajectoryPoint {
  x: number
  y: number
  t: number
  pressure?: number
}

interface DeviceFingerprint {
  webdriver: boolean
  screenRes: string
  plugins: number
  touchPoints: number
  platform: string
  userAgent: string
  languages: string[]
  timezone: string
  cookieEnabled: boolean
  doNotTrack: string | null
}

interface ImageChallengeResponse {
  selectedImages: number[]
  timeSpent: number
  clickPattern: { index: number; timestamp: number }[]
}

interface VerificationRequest {
  // Behavioral biometrics
  trajectory?: TrajectoryPoint[]
  deviceData: DeviceFingerprint

  // Image challenge
  imageChallenge?: ImageChallengeResponse
  challengeId?: string

  // Math challenge
  mathAnswer?: number
  mathChallengeId?: string

  // Honeypot fields
  honeypot?: string

  // Timing analysis
  pageLoadTime: number
  interactionStartTime: number
}

interface ChallengeData {
  id: string
  type: 'image' | 'math' | 'slider'
  correctAnswer: number[] | number
  createdAt: number
  category?: string
}

// In-memory storage for challenges (w produkcji użyj Redis)
const activeChallenges = new Map<string, ChallengeData>()

// Czyszczenie starych wyzwań (starszych niż 5 minut)
setInterval(() => {
  const now = Date.now()
  for (const [id, data] of activeChallenges.entries()) {
    if (now - data.createdAt > 5 * 60 * 1000) {
      activeChallenges.delete(id)
    }
  }
}, 60 * 1000)

/**
 * Generowanie wyzwania obrazkowego
 */
export async function generateImageChallenge() {
  const categories = [
    { name: 'traffic_lights', label: 'Światła drogowe', imageCount: 9 },
    { name: 'crosswalks', label: 'Przejścia dla pieszych', imageCount: 9 },
    { name: 'bicycles', label: 'Rowery', imageCount: 9 },
    { name: 'buses', label: 'Autobusy', imageCount: 9 },
    { name: 'bridges', label: 'Mosty', imageCount: 9 },
  ]

  const selectedCategory = categories[Math.floor(Math.random() * categories.length)]
  const challengeId = crypto.randomBytes(16).toString('hex')

  // Losowo wybieramy które obrazki zawierają obiekt (2-4 obrazki)
  const correctCount = Math.floor(Math.random() * 3) + 2
  const correctIndices: number[] = []

  while (correctIndices.length < correctCount) {
    const index = Math.floor(Math.random() * selectedCategory.imageCount)
    if (!correctIndices.includes(index)) {
      correctIndices.push(index)
    }
  }

  // Zapisujemy wyzwanie
  activeChallenges.set(challengeId, {
    id: challengeId,
    type: 'image',
    correctAnswer: correctIndices.sort(),
    createdAt: Date.now(),
    category: selectedCategory.name,
  })

  return {
    challengeId,
    category: selectedCategory.name,
    label: selectedCategory.label,
    imageCount: selectedCategory.imageCount,
    // W prawdziwej implementacji zwróciłbyś URL-e do obrazków
    images: Array.from({ length: selectedCategory.imageCount }, (_, i) => ({
      id: i,
      url: `/api/captcha/images/${selectedCategory.name}/${i}`,
      thumbnail: `/api/captcha/images/${selectedCategory.name}/${i}/thumb`,
    })),
  }
}

/**
 * Generowanie wyzwania matematycznego
 */
export async function generateMathChallenge() {
  const operations = [
    { a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 10) + 1, op: '+' },
    { a: Math.floor(Math.random() * 20) + 10, b: Math.floor(Math.random() * 10) + 1, op: '-' },
    { a: Math.floor(Math.random() * 10) + 1, b: Math.floor(Math.random() * 5) + 1, op: '×' },
  ]

  const challenge = operations[Math.floor(Math.random() * operations.length)]
  let answer: number

  switch (challenge.op) {
    case '+':
      answer = challenge.a + challenge.b
      break
    case '-':
      answer = challenge.a - challenge.b
      break
    case '×':
      answer = challenge.a * challenge.b
      break
    default:
      answer = 0
  }

  const challengeId = crypto.randomBytes(16).toString('hex')

  activeChallenges.set(challengeId, {
    id: challengeId,
    type: 'math',
    correctAnswer: answer,
    createdAt: Date.now(),
  })

  return {
    challengeId,
    question: `${challenge.a} ${challenge.op} ${challenge.b} = ?`,
    a: challenge.a,
    b: challenge.b,
    operation: challenge.op,
  }
}

/**
 * Zaawansowana analiza trajektorii ruchu myszy
 */
function analyzeTrajectory(trajectory: TrajectoryPoint[]): {
  isHuman: boolean
  confidence: number
  reasons: string[]
} {
  const reasons: string[] = []
  let confidence = 100

  if (trajectory.length < 10) {
    reasons.push('Zbyt krótka trajektoria')
    confidence -= 40
    return { isHuman: false, confidence, reasons }
  }

  // 1. Analiza wariancji prędkości (ludzie nie poruszają się ze stałą prędkością)
  const velocities: number[] = []
  for (let i = 1; i < trajectory.length; i++) {
    const dx = trajectory[i].x - trajectory[i - 1].x
    const dy = trajectory[i].y - trajectory[i - 1].y
    const dt = trajectory[i].t - trajectory[i - 1].t
    const velocity = Math.sqrt(dx * dx + dy * dy) / (dt || 1)
    velocities.push(velocity)
  }

  const avgVelocity = velocities.reduce((a, b) => a + b, 0) / velocities.length
  const velocityVariance =
    velocities.reduce((sum, v) => sum + Math.pow(v - avgVelocity, 2), 0) / velocities.length

  if (velocityVariance < 0.01) {
    reasons.push('Ruch zbyt regularny (brak ludzkiej wariancji)')
    confidence -= 30
  }

  // 2. Analiza krzywizny (ludzie robią płynne łuki, nie proste linie)
  let totalCurvature = 0
  for (let i = 2; i < trajectory.length; i++) {
    const v1x = trajectory[i - 1].x - trajectory[i - 2].x
    const v1y = trajectory[i - 1].y - trajectory[i - 2].y
    const v2x = trajectory[i].x - trajectory[i - 1].x
    const v2y = trajectory[i].y - trajectory[i - 1].y

    const dotProduct = v1x * v2x + v1y * v2y
    const mag1 = Math.sqrt(v1x * v1x + v1y * v1y)
    const mag2 = Math.sqrt(v2x * v2x + v2y * v2y)

    if (mag1 > 0 && mag2 > 0) {
      const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct / (mag1 * mag2))))
      totalCurvature += angle
    }
  }

  if (totalCurvature < 0.1) {
    reasons.push('Trajektoria zbyt liniowa')
    confidence -= 25
  }

  // 3. Analiza mikro-ruchów (drobne korekty charakterystyczne dla ludzi)
  let microMovements = 0
  for (let i = 1; i < trajectory.length; i++) {
    const distance = Math.sqrt(
      Math.pow(trajectory[i].x - trajectory[i - 1].x, 2) +
        Math.pow(trajectory[i].y - trajectory[i - 1].y, 2),
    )
    if (distance < 2 && distance > 0) {
      microMovements++
    }
  }

  if (microMovements < trajectory.length * 0.1) {
    reasons.push('Brak mikro-ruchów charakterystycznych dla człowieka')
    confidence -= 20
  }

  // 4. Analiza pressure (jeśli dostępne)
  if (trajectory.some((p) => p.pressure !== undefined)) {
    const pressures = trajectory.filter((p) => p.pressure !== undefined).map((p) => p.pressure!)
    const pressureVariance =
      pressures.reduce((sum, p) => sum + Math.pow(p - 0.5, 2), 0) / pressures.length

    if (pressureVariance < 0.01) {
      reasons.push('Stały nacisk (charakterystyczne dla botów)')
      confidence -= 15
    }
  }

  return {
    isHuman: confidence > 50,
    confidence: Math.max(0, confidence),
    reasons,
  }
}

/**
 * Analiza fingerprinta urządzenia
 */
function analyzeDeviceFingerprint(device: DeviceFingerprint): {
  isSuspicious: boolean
  score: number
  flags: string[]
} {
  const flags: string[] = []
  let suspicionScore = 0

  // 1. Wykrywanie headless browsers
  if (device.webdriver) {
    flags.push('WebDriver wykryty (Selenium/Puppeteer)')
    suspicionScore += 50
  }

  // 2. Analiza pluginów (headless browsers często mają 0 pluginów)
  if (device.plugins === 0 && !device.userAgent.includes('Mobile')) {
    flags.push('Brak pluginów przeglądarki')
    suspicionScore += 20
  }

  // 3. Analiza touch points (niespójność z typem urządzenia)
  const isMobile = /Mobile|Android|iPhone|iPad/.test(device.userAgent)
  if (isMobile && device.touchPoints === 0) {
    flags.push('Urządzenie mobilne bez wsparcia dotyku')
    suspicionScore += 25
  }

  // 4. Sprawdzanie cookies
  if (!device.cookieEnabled) {
    flags.push('Cookies wyłączone')
    suspicionScore += 15
  }

  // 5. Analiza języków (boty często mają nietypowe ustawienia)
  if (device.languages.length === 0) {
    flags.push('Brak języków przeglądarki')
    suspicionScore += 20
  }

  // 6. Analiza rozdzielczości ekranu
  const [width, height] = device.screenRes.split('x').map(Number)
  if (width < 800 || height < 600 || width > 7680 || height > 4320) {
    flags.push('Nietypowa rozdzielczość ekranu')
    suspicionScore += 10
  }

  return {
    isSuspicious: suspicionScore > 30,
    score: suspicionScore,
    flags,
  }
}

/**
 * Analiza wzorca kliknięć w wyzwaniu obrazkowym
 */
function analyzeClickPattern(clickPattern: { index: number; timestamp: number }[]): {
  isHuman: boolean
  confidence: number
  reasons: string[]
} {
  const reasons: string[] = []
  let confidence = 100

  if (clickPattern.length === 0) {
    return { isHuman: false, confidence: 0, reasons: ['Brak kliknięć'] }
  }

  // 1. Analiza czasu między kliknięciami
  const intervals: number[] = []
  for (let i = 1; i < clickPattern.length; i++) {
    intervals.push(clickPattern[i].timestamp - clickPattern[i - 1].timestamp)
  }

  // Boty często klikają w regularnych odstępach
  if (intervals.length > 1) {
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const intervalVariance =
      intervals.reduce((sum, int) => sum + Math.pow(int - avgInterval, 2), 0) / intervals.length

    if (intervalVariance < 100) {
      reasons.push('Zbyt regularne odstępy między kliknięciami')
      confidence -= 30
    }
  }

  // 2. Zbyt szybkie klikanie (boty mogą klikać natychmiast)
  const tooFastClicks = intervals.filter((int) => int < 200).length
  if (tooFastClicks > intervals.length * 0.5) {
    reasons.push('Nienaturalnie szybkie klikanie')
    confidence -= 25
  }

  // 3. Analiza kolejności (boty często klikają po kolei)
  let sequential = 0
  for (let i = 1; i < clickPattern.length; i++) {
    if (clickPattern[i].index === clickPattern[i - 1].index + 1) {
      sequential++
    }
  }

  if (sequential === clickPattern.length - 1 && clickPattern.length > 2) {
    reasons.push('Sekwencyjne klikanie (charakterystyczne dla botów)')
    confidence -= 35
  }

  return {
    isHuman: confidence > 50,
    confidence: Math.max(0, confidence),
    reasons,
  }
}

/**
 * Główna funkcja weryfikacji
 */
export async function verifyCaptcha(data: VerificationRequest) {
  try {
    const securityChecks: string[] = []
    let trustScore = 100

    // 1. Sprawdzenie honeypot (ukryte pole, które boty wypełniają)
    if (data.honeypot && data.honeypot.length > 0) {
      return {
        verified: false,
        error: 'Wykryto podejrzaną aktywność',
        details: { reason: 'honeypot_filled' },
      }
    }

    // 2. Analiza czasu interakcji
    const interactionTime = Date.now() - data.interactionStartTime
    if (interactionTime < 2000) {
      securityChecks.push('Zbyt szybkie wypełnienie')
      trustScore -= 30
    }
    if (interactionTime > 600000) {
      // 10 minut
      securityChecks.push('Zbyt długi czas wypełnienia')
      trustScore -= 10
    }

    // 3. Analiza fingerprinta urządzenia
    const deviceAnalysis = analyzeDeviceFingerprint(data.deviceData)
    if (deviceAnalysis.isSuspicious) {
      securityChecks.push(...deviceAnalysis.flags)
      trustScore -= deviceAnalysis.score
    }

    // 4. Weryfikacja wyzwania obrazkowego
    if (data.imageChallenge && data.challengeId) {
      const challenge = activeChallenges.get(data.challengeId)

      if (!challenge) {
        return {
          verified: false,
          error: 'Wyzwanie wygasło lub nie istnieje',
        }
      }

      if (challenge.type !== 'image') {
        return {
          verified: false,
          error: 'Nieprawidłowy typ wyzwania',
        }
      }

      // Sprawdzenie poprawności odpowiedzi
      const correctAnswer = challenge.correctAnswer as number[]
      const userAnswer = data.imageChallenge.selectedImages.sort()

      const isCorrect = JSON.stringify(correctAnswer) === JSON.stringify(userAnswer)

      if (!isCorrect) {
        activeChallenges.delete(data.challengeId)
        return {
          verified: false,
          error: 'Nieprawidłowa odpowiedź',
          details: { type: 'wrong_answer' },
        }
      }

      // Analiza wzorca kliknięć
      const clickAnalysis = analyzeClickPattern(data.imageChallenge.clickPattern)
      if (!clickAnalysis.isHuman) {
        securityChecks.push(...clickAnalysis.reasons)
        trustScore -= 100 - clickAnalysis.confidence
      }

      // Analiza czasu spędzonego na wyzwaniu
      if (data.imageChallenge.timeSpent < 1000) {
        securityChecks.push('Zbyt szybkie rozwiązanie wyzwania')
        trustScore -= 25
      }

      activeChallenges.delete(data.challengeId)
    }

    // 5. Weryfikacja wyzwania matematycznego
    if (data.mathAnswer !== undefined && data.mathChallengeId) {
      const challenge = activeChallenges.get(data.mathChallengeId)

      if (!challenge) {
        return {
          verified: false,
          error: 'Wyzwanie wygasło lub nie istnieje',
        }
      }

      if (challenge.type !== 'math') {
        return {
          verified: false,
          error: 'Nieprawidłowy typ wyzwania',
        }
      }

      if (challenge.correctAnswer !== data.mathAnswer) {
        activeChallenges.delete(data.mathChallengeId)
        return {
          verified: false,
          error: 'Nieprawidłowa odpowiedź matematyczna',
        }
      }

      activeChallenges.delete(data.mathChallengeId)
    }

    // 6. Analiza trajektorii ruchu (dla slider CAPTCHA)
    if (data.trajectory && data.trajectory.length > 0) {
      const trajectoryAnalysis = analyzeTrajectory(data.trajectory)
      if (!trajectoryAnalysis.isHuman) {
        securityChecks.push(...trajectoryAnalysis.reasons)
        trustScore -= 100 - trajectoryAnalysis.confidence
      }
    }

    // Decyzja finalna
    if (trustScore < 40) {
      return {
        verified: false,
        error: 'Weryfikacja nieudana',
        details: {
          trustScore,
          reasons: securityChecks,
        },
      }
    }

    // Generowanie bezpiecznego tokenu
    const token = crypto
      .createHash('sha512')
      .update(`${JSON.stringify(data)}-${Date.now()}-${crypto.randomBytes(32).toString('hex')}`)
      .digest('hex')

    return {
      verified: true,
      token,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minut
      trustScore,
      details: {
        checks: securityChecks.length,
        warnings: securityChecks,
      },
    }
  } catch (error) {
    console.error('Advanced CAPTCHA error:', error)
    return {
      verified: false,
      error: 'Błąd systemowy weryfikacji',
    }
  }
}

/**
 * Pomocnicza funkcja do walidacji tokenu
 */
export async function validateToken(token: string): Promise<boolean> {
  // W produkcji: sprawdź token w bazie/Redis
  // Tutaj: prosty przykład
  return token.length === 128 // SHA-512 hex ma 128 znaków
}

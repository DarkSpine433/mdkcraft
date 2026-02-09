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
  trajectory?: TrajectoryPoint[]
  deviceData: DeviceFingerprint
  imageChallenge?: ImageChallengeResponse
  challengeId?: string
  mathAnswer?: number
  mathChallengeId?: string
  honeypot?: string
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

interface StoredToken {
  token: string
  verified: boolean
  trustScore: number
  createdAt: number
  expiresAt: number
  used: boolean
}

const activeChallenges = new Map<string, ChallengeData>()
const validTokens = new Map<string, StoredToken>()

setInterval(() => {
  const now = Date.now()
  for (const [id, data] of activeChallenges.entries()) {
    if (now - data.createdAt > 5 * 60 * 1000) {
      activeChallenges.delete(id)
    }
  }
  for (const [token, data] of validTokens.entries()) {
    if (now > data.expiresAt) {
      validTokens.delete(token)
    }
  }
}, 60 * 1000)

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

  const correctCount = Math.floor(Math.random() * 3) + 2
  const correctIndices: number[] = []

  while (correctIndices.length < correctCount) {
    const index = Math.floor(Math.random() * selectedCategory.imageCount)
    if (!correctIndices.includes(index)) {
      correctIndices.push(index)
    }
  }

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
    images: Array.from({ length: selectedCategory.imageCount }, (_, i) => ({
      id: i,
      url: `/api/captcha/images/${selectedCategory.name}/${i}`,
      thumbnail: `/api/captcha/images/${selectedCategory.name}/${i}/thumb`,
    })),
  }
}

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

function analyzeTrajectory(trajectory: TrajectoryPoint[]) {
  const reasons: string[] = []
  let confidence = 100

  if (trajectory.length < 10) {
    reasons.push('Zbyt krótka trajektoria')
    confidence -= 40
    return { isHuman: false, confidence, reasons }
  }

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
    reasons.push('Ruch zbyt regularny')
    confidence -= 30
  }

  return {
    isHuman: confidence > 50,
    confidence: Math.max(0, confidence),
    reasons,
  }
}

function analyzeDeviceFingerprint(device: DeviceFingerprint) {
  const flags: string[] = []
  let suspicionScore = 0

  if (device.webdriver) {
    flags.push('WebDriver wykryty')
    suspicionScore += 50
  }

  if (device.plugins === 0 && !device.userAgent.includes('Mobile')) {
    flags.push('Brak pluginów przeglądarki')
    suspicionScore += 20
  }

  return {
    isSuspicious: suspicionScore > 30,
    score: suspicionScore,
    flags,
  }
}

function analyzeClickPattern(clickPattern: { index: number; timestamp: number }[]) {
  const reasons: string[] = []
  let confidence = 100

  if (clickPattern.length === 0) {
    return { isHuman: false, confidence: 0, reasons: ['Brak kliknięć'] }
  }

  const intervals: number[] = []
  for (let i = 1; i < clickPattern.length; i++) {
    intervals.push(clickPattern[i].timestamp - clickPattern[i - 1].timestamp)
  }

  if (intervals.length > 1) {
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const intervalVariance =
      intervals.reduce((sum, int) => sum + Math.pow(int - avgInterval, 2), 0) / intervals.length

    if (intervalVariance < 100) {
      reasons.push('Zbyt regularne odstępy')
      confidence -= 30
    }
  }

  return {
    isHuman: confidence > 50,
    confidence: Math.max(0, confidence),
    reasons,
  }
}

export async function verifyCaptcha(data: VerificationRequest) {
  try {
    const securityChecks: string[] = []
    let trustScore = 100

    if (data.honeypot && data.honeypot.length > 0) {
      return {
        verified: false,
        error: 'Wykryto podejrzaną aktywność',
      }
    }

    const interactionTime = Date.now() - data.interactionStartTime
    if (interactionTime < 2000) {
      securityChecks.push('Zbyt szybkie wypełnienie')
      trustScore -= 30
    }

    const deviceAnalysis = analyzeDeviceFingerprint(data.deviceData)
    if (deviceAnalysis.isSuspicious) {
      securityChecks.push(...deviceAnalysis.flags)
      trustScore -= deviceAnalysis.score
    }

    if (data.imageChallenge && data.challengeId) {
      const challenge = activeChallenges.get(data.challengeId)

      if (!challenge) {
        return {
          verified: false,
          error: 'Wyzwanie wygasło lub nie istnieje',
        }
      }

      const correctAnswer = challenge.correctAnswer as number[]
      const userAnswer = data.imageChallenge.selectedImages.sort()

      if (JSON.stringify(correctAnswer) !== JSON.stringify(userAnswer)) {
        activeChallenges.delete(data.challengeId)
        return {
          verified: false,
          error: 'Nieprawidłowa odpowiedź',
        }
      }

      const clickAnalysis = analyzeClickPattern(data.imageChallenge.clickPattern)
      if (!clickAnalysis.isHuman) {
        trustScore -= 100 - clickAnalysis.confidence
      }

      activeChallenges.delete(data.challengeId)
    }

    if (data.mathAnswer !== undefined && data.mathChallengeId) {
      const challenge = activeChallenges.get(data.mathChallengeId)

      if (!challenge || challenge.correctAnswer !== data.mathAnswer) {
        activeChallenges.delete(data.mathChallengeId!)
        return {
          verified: false,
          error: 'Nieprawidłowa odpowiedź matematyczna',
        }
      }

      activeChallenges.delete(data.mathChallengeId)
    }

    if (data.trajectory && data.trajectory.length > 0) {
      const trajectoryAnalysis = analyzeTrajectory(data.trajectory)
      if (!trajectoryAnalysis.isHuman) {
        trustScore -= 100 - trajectoryAnalysis.confidence
      }
    }

    if (trustScore < 40) {
      return {
        verified: false,
        error: 'Weryfikacja nieudana - zbyt niski wynik zaufania',
      }
    }

    const token = crypto
      .createHash('sha512')
      .update(`${JSON.stringify(data)}-${Date.now()}-${crypto.randomBytes(32).toString('hex')}`)
      .digest('hex')

    const expiresAt = Date.now() + 10 * 60 * 1000

    validTokens.set(token, {
      token,
      verified: true,
      trustScore,
      createdAt: Date.now(),
      expiresAt,
      used: false,
    })

    return {
      verified: true,
      token,
      expiresAt,
      trustScore,
    }
  } catch (error) {
    console.error('CAPTCHA error:', error)
    return {
      verified: false,
      error: 'Błąd systemowy weryfikacji',
    }
  }
}

export async function validateCaptchaToken(token: string) {
  try {
    const tokenData = validTokens.get(token)

    if (!tokenData) {
      return {
        valid: false,
        error: 'Nieprawidłowy token CAPTCHA',
      }
    }

    if (Date.now() > tokenData.expiresAt) {
      validTokens.delete(token)
      return {
        valid: false,
        error: 'Token CAPTCHA wygasł',
      }
    }

    if (tokenData.used) {
      return {
        valid: false,
        error: 'Token CAPTCHA został już użyty',
      }
    }

    tokenData.used = true
    validTokens.set(token, tokenData)

    setTimeout(() => {
      validTokens.delete(token)
    }, 60 * 1000)

    return {
      valid: true,
      trustScore: tokenData.trustScore,
    }
  } catch (error) {
    console.error('Token validation error:', error)
    return {
      valid: false,
      error: 'Błąd walidacji tokenu',
    }
  }
}

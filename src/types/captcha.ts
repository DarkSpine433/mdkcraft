export interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  message: string
}
export type CaptchaMode = 'slider' | 'image' | 'math' | 'auto'

export interface ImageChallenge {
  challengeId: string
  category: string
  label: string
  imageCount: number
  images: { id: number; url: string; thumbnail: string }[]
}

export interface MathChallenge {
  challengeId: string
  question: string
  a: number
  b: number
  operation: string
}

export type ContactSubmission = {
  // Osobiste/Bazowe
  name: string
  email: string
  phone?: string
  company?: string

  // I. Informacje Ogólne
  companyName?: string
  currentUrl?: string
  businessDescription?: string
  targetAudience?: string

  // II. Zakres i Cele
  mainGoal?: string
  subpagesCount?: string
  extraFeatures?: string[]

  // III. Design i Estetyka
  designLevel?: string // ID of ConfiguratorOption
  brandingStatus?: string
  inspirationLinks?: string

  // IV. Logistyka i Treści
  contentProvider?: string
  hasDomainHosting?: string
  plannedLaunchDate?: string
  budgetRange?: string

  // Systemowe
  projectType: string
  budget: string
  timeline: string
  message: string
  sessionId?: string
  captchaToken: string
  formInteractionTime?: number
  ipAddress?: string
}

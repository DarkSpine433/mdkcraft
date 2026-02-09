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
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  message: string
  sessionId?: string
  captchaToken: string
  formInteractionTime?: number
  ipAddress?: string
}

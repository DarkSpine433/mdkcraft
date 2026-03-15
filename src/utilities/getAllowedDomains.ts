import { getServerSideURL } from './getURL'

export const getAllowedDomains = (): string[] => {
  const serverUrl = getServerSideURL()

  const baseDomains: string[] = [
    `${serverUrl}`,
    'https://uploadthing.com',
    'http://mongodb.net',
    'https://mongodb.net',
    'https://mongodb.com',
    'http://mongodb.com',
    'https://ufs.sh',
    'http://ufs.sh',
  ]

  if (serverUrl?.includes('localhos t')) {
    baseDomains.push('http://localhost:3000')
  }

  return baseDomains.filter(Boolean) // Remove any undefined values
}

import type { User } from '@/payload-types'
import type { Payload, PayloadRequest } from 'payload'

export const seedClientFiles = async ({
  payload,
  req,
  user,
}: {
  payload: Payload
  req: PayloadRequest
  user: User
}): Promise<void> => {
  payload.logger.info(`— Seeding client files...`)

  // Note: Client Files usually require an actual file upload.
  // For seeding without actual files, we might skip creating the file document itself
  // or use dummy data if the collection allows optional file (unlikely for 'upload' type collections).
  // Assuming 'client-files' is an upload collection.

  // We can try to seed a dummy text file.
  const dummyFileBuffer = Buffer.from('Dummy client file content', 'utf-8')

  const files = [
    {
      name: 'Umowa-wspolpracy.pdf',
      data: {
        client: user.id,
        description: 'Umowa Współpracy 2025',
      },
    },
    {
      name: 'Raport-Q1.pdf',
      data: {
        client: user.id,
        description: 'Raport Kwartalny Q1',
      },
    },
  ]

  for (const file of files) {
    await payload.create({
      collection: 'client-files',
      data: file.data,
      file: {
        data: dummyFileBuffer,
        name: file.name,
        mimetype: 'application/pdf',
        size: dummyFileBuffer.length,
      },
      req,
      draft: false,
    })
  }
}

import type { Payload, PayloadRequest } from 'payload'

export const seedSiteSettings = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info(`— Seeding site settings...`)

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'MDKcraft',
      description: 'Modern Web Development Services',
      contactEmail: 'kontakt@mdkcraft.pl',
      maintenanceMode: false,
    },
    req,
  })
}

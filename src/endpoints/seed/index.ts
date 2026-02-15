import type { CollectionSlug, File, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { Address, Transaction, VariantOption } from '@/payload-types'
import { seedAnalytics } from './analytics'
import { seedClientFiles } from './client-files'
import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { seedFaq } from './faq'
import { homePageData } from './home'
import { imageHatData } from './image-hat'
import { imageHero1Data } from './image-hero-1'
import { imageTshirtBlackData } from './image-tshirt-black'
import { imageTshirtWhiteData } from './image-tshirt-white'
import { seedOpinions } from './opinions'
import { productHatData } from './product-hat'
import { productTshirtData, productTshirtVariant } from './product-tshirt'
import { seedProjects } from './projects'
import { seedRoadmap } from './roadmap'
import { seedShowcases } from './showcases'
import { seedSiteSettings } from './site-settings'
import { seedSubscriptions } from './subscriptions'
import { seedTickets } from './tickets'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'products',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
  'showcases',
  'projects',
  'tickets',
  'faq',
  'subscription-plans',
  'subscription-addons',
  'roadmap',
  'client-files',
  'contact-inquiries',
  'newsletter-subscribers',
  'page-views',
  'project-views',
  'user-sessions',
  'user-behavior-events',
  'heatmap-data',
]

const categories = ['Accessories', 'T-Shirts', 'Hats', 'Opinions']

const sizeVariantOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'X Large', value: 'xlarge' },
]

const colorVariantOptions = [
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
]

const globals: GlobalSlug[] = ['header', 'footer', 'site-settings']

const baseAddressUSData: Transaction['billingAddress'] = {
  title: 'Dr.',
  firstName: 'Otto',
  lastName: 'Octavius',
  phone: '1234567890',
  company: 'Oscorp',
  addressLine1: '123 Main St',
  addressLine2: 'Suite 100',
  city: 'New York',
  state: 'NY',
  postalCode: '10001',
  country: 'US',
}

const baseAddressUKData: Transaction['billingAddress'] = {
  title: 'Mr.',
  firstName: 'Oliver',
  lastName: 'Twist',
  phone: '1234567890',
  addressLine1: '48 Great Portland St',
  city: 'London',
  postalCode: 'W1W 7ND',
  country: 'GB',
}

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections and globals...`)

  // clear globals
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        req,
        slug: global,
        data: {},
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  // clear collections
  for (const collection of collections) {
    if (payload.collections[collection]) {
      await payload.db.deleteMany({ collection, req, where: {} })
      if (payload.collections[collection].config.versions) {
        await payload.db.deleteVersions({ collection, req, where: {} })
      }
    }
  }

  payload.logger.info(`— Seeding customer and customer data...`)

  await payload.delete({
    req,
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'customer@example.com',
      },
    },
  })

  const customer = await payload.create({
    req,
    collection: 'users',
    data: {
      name: 'Customer',
      email: 'customer@example.com',
      password: 'password',
      roles: ['customer'],
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [imageHatBuffer, imageTshirtBlackBuffer, imageTshirtWhiteBuffer, heroBuffer] =
    await Promise.all([
      fetchFileByURL(
        'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/ecommerce/src/endpoints/seed/hat-logo.png',
      ),
      fetchFileByURL(
        'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/ecommerce/src/endpoints/seed/tshirt-black.png',
      ),
      fetchFileByURL(
        'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/ecommerce/src/endpoints/seed/tshirt-white.png',
      ),
      fetchFileByURL(
        'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
      ),
    ])

  payload.logger.info('— Creating media...')

  // Create Media Sequentially
  const imageHat = await payload.create({
    collection: 'media',
    data: imageHatData,
    file: imageHatBuffer,
    overrideAccess: true,
  })

  const imageTshirtBlack = await payload.create({
    collection: 'media',
    data: imageTshirtBlackData,
    file: imageTshirtBlackBuffer,
    overrideAccess: true,
  })

  const imageTshirtWhite = await payload.create({
    collection: 'media',
    data: imageTshirtWhiteData,
    file: imageTshirtWhiteBuffer,
    overrideAccess: true,
  })

  const imageHero = await payload.create({
    collection: 'media',
    data: imageHero1Data,
    file: heroBuffer,
    overrideAccess: true,
  })

  // Create Categories
  const [accessoriesCategory, tshirtsCategory, hatsCategory] = await Promise.all(
    categories.map((category) =>
      payload.create({
        req,
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  )

  // Fetch avatars
  const avatarUrls = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/86.jpg',
    'https://randomuser.me/api/portraits/women/68.jpg',
    'https://randomuser.me/api/portraits/men/46.jpg',
    'https://randomuser.me/api/portraits/women/65.jpg',
    'https://randomuser.me/api/portraits/men/33.jpg',
    'https://randomuser.me/api/portraits/women/22.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/women/8.jpg',
    'https://randomuser.me/api/portraits/men/8.jpg',
    'https://randomuser.me/api/portraits/men/1.jpg',
  ]

  const avatarBuffers = await Promise.all(
    avatarUrls.map(async (url) => {
      try {
        return await fetchFileByURL(url)
      } catch (e) {
        console.error(`Failed to fetch avatar ${url}`, e)
        return null
      }
    }),
  ).then((results) => results.filter((r): r is File => r !== null))

  // Create avatar media items sequentially to avoid race conditions and unique constraint errors
  const avatars = []
  for (let i = 0; i < avatarBuffers.length; i++) {
    const buffer = avatarBuffers[i]
    const createdAvatar = await payload.create({
      collection: 'media',
      data: {
        alt: `Avatar ${i + 1}`,
      },
      file: buffer,
      overrideAccess: true,
    })
    avatars.push(createdAvatar)
  }

  payload.logger.info(`— Seeding variant types and options...`)

  const sizeVariantType = await payload.create({
    req,
    collection: 'variantTypes',
    data: {
      name: 'size',
      label: 'Size',
    },
  })

  const sizeVariantOptionsResults: VariantOption[] = []

  for (const option of sizeVariantOptions) {
    const result = await payload.create({
      req,
      collection: 'variantOptions',
      data: {
        ...option,
        variantType: sizeVariantType.id,
      },
    })
    sizeVariantOptionsResults.push(result)
  }

  const [small, medium, large, xlarge] = sizeVariantOptionsResults

  const colorVariantType = await payload.create({
    req,
    collection: 'variantTypes',
    data: {
      name: 'color',
      label: 'Color',
    },
  })

  const [black, white] = await Promise.all(
    colorVariantOptions.map((option) => {
      return payload.create({
        req,
        collection: 'variantOptions',
        data: {
          ...option,
          variantType: colorVariantType.id,
        },
      })
    }),
  )

  payload.logger.info(`— Seeding products...`)

  const productHat = await payload.create({
    req,
    collection: 'products',
    depth: 0,
    data: productHatData({
      galleryImage: imageHat,
      metaImage: imageHat,
      variantTypes: [colorVariantType],
      categories: [hatsCategory],
      relatedProducts: [],
    }),
  })

  const productTshirt = await payload.create({
    req,
    collection: 'products',
    depth: 0,
    data: productTshirtData({
      galleryImages: [
        { image: imageTshirtBlack, variantOption: black },
        { image: imageTshirtWhite, variantOption: white },
      ],
      metaImage: imageTshirtBlack,
      contentImage: imageHero,
      variantTypes: [colorVariantType, sizeVariantType],
      categories: [tshirtsCategory],
      relatedProducts: [productHat],
    }),
  })

  const [
    smallTshirtHoodieVariant,
    mediumTshirtHoodieVariant,
    _largeTshirtHoodieVariant,
    _xlargeTshirtHoodieVariant,
  ] = await Promise.all(
    [small, medium, large, xlarge].map((variantOption) =>
      payload.create({
        req,
        collection: 'variants',
        depth: 0,
        data: productTshirtVariant({
          product: productTshirt,
          variantOptions: [variantOption, white],
        }),
      }),
    ),
  )

  await Promise.all(
    [small, medium, large, xlarge].map((variantOption) =>
      payload.create({
        req,
        collection: 'variants',
        depth: 0,
        data: productTshirtVariant({
          product: productTshirt,
          variantOptions: [variantOption, black],
          ...(variantOption.value === 'medium' ? { inventory: 0 } : {}),
        }),
      }),
    ),
  )

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    req,
    collection: 'forms',
    depth: 0,
    data: contactFormData(),
  })

  payload.logger.info(`— Seeding pages...`)

  await Promise.all([
    payload.create({
      req,
      collection: 'pages',
      depth: 0,
      data: homePageData({
        contentImage: imageHero,
        metaImage: imageHat,
      }),
    }),
    payload.create({
      req,
      collection: 'pages',
      depth: 0,
      data: contactPageData({
        contactForm: contactForm,
      }),
    }),
  ])

  payload.logger.info(`— Seeding showcases...`)

  await seedShowcases({
    req,
    payload,
    thumbnail: imageHero,
  })

  payload.logger.info(`— Seeding projects...`)

  await seedProjects({
    req,
    payload,
    media: [imageHero, imageHat, imageTshirtBlack],
    categories: [accessoriesCategory, tshirtsCategory, hatsCategory],
  })

  await seedTickets({ req, payload, user: customer })
  await seedFaq({ req, payload })
  await seedSubscriptions({ req, payload })
  await seedRoadmap({ req, payload })
  await seedClientFiles({ req, payload, user: customer })
  await seedSiteSettings({ req, payload })
  await seedAnalytics({ req, payload })

  payload.logger.info(`— Seeding opinions...`)

  await seedOpinions({
    req,
    payload,
    media: avatars,
  })

  payload.logger.info(`— Seeding addresses...`)

  await payload.create({
    req,
    collection: 'addresses',
    depth: 0,
    data: {
      customer: customer.id,
      ...(baseAddressUSData as Address),
    },
  })

  await payload.create({
    req,
    collection: 'addresses',
    depth: 0,
    data: {
      customer: customer.id,
      ...(baseAddressUKData as Address),
    },
  })

  payload.logger.info(`— Seeding transactions...`)

  const succeededTransaction = await payload.create({
    req,
    collection: 'transactions',
    data: {
      currency: 'USD',
      customer: customer.id,
      paymentMethod: 'stripe',
      stripe: {
        customerID: 'cus_123',
        paymentIntentID: 'pi_123',
      },
      status: 'succeeded',
      billingAddress: baseAddressUSData,
    },
  })

  payload.logger.info(`— Seeding carts...`)

  // This cart is open as it's created now
  await payload.create({
    req,
    collection: 'carts',
    data: {
      customer: customer.id,
      currency: 'USD',
      items: [
        {
          product: productTshirt.id,
          variant: mediumTshirtHoodieVariant.id,
          quantity: 1,
        },
      ],
    },
  })

  const oldTimestamp = new Date('2023-01-01T00:00:00Z').toISOString()

  // Cart is abandoned
  await payload.create({
    req,
    collection: 'carts',
    data: {
      currency: 'USD',
      createdAt: oldTimestamp,
      items: [
        {
          product: productHat.id,
          quantity: 1,
        },
      ],
    },
  })

  // Cart is purchased
  await payload.create({
    req,
    collection: 'carts',
    data: {
      customer: customer.id,
      currency: 'USD',
      purchasedAt: new Date().toISOString(),
      subtotal: 7499,
      items: [
        {
          product: productTshirt.id,
          variant: smallTshirtHoodieVariant.id,
          quantity: 1,
        },
        {
          product: productTshirt.id,
          variant: mediumTshirtHoodieVariant.id,
          quantity: 1,
        },
      ],
    },
  })

  payload.logger.info(`— Seeding orders...`)

  await payload.create({
    req,
    collection: 'orders',
    data: {
      amount: 7499,
      currency: 'USD',
      customer: customer.id,
      shippingAddress: baseAddressUSData,
      items: [
        {
          product: productTshirt.id,
          variant: smallTshirtHoodieVariant.id,
          quantity: 1,
        },
        {
          product: productTshirt.id,
          variant: mediumTshirtHoodieVariant.id,
          quantity: 1,
        },
      ],
      status: 'completed',
      transactions: [succeededTransaction.id],
    },
  })

  await payload.create({
    req,
    collection: 'orders',
    data: {
      amount: 7499,
      currency: 'USD',
      customer: customer.id,
      shippingAddress: baseAddressUSData,
      items: [
        {
          product: productTshirt.id,
          variant: smallTshirtHoodieVariant.id,
          quantity: 1,
        },
        {
          product: productTshirt.id,
          variant: mediumTshirtHoodieVariant.id,
          quantity: 1,
        },
      ],
      status: 'processing',
      transactions: [succeededTransaction.id],
    },
  })

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      req,
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Home',
              url: '/',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Shop',
              url: '/shop',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Account',
              url: '/account',
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      req,
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Find my order',
              url: '/find-order',
              newTab: false,
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/main/templates/website',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      method: 'GET',
    })

    if (!res.ok) {
      // Log warning but continue to fallback
      console.warn(`Fetch failed for ${url}: ${res.status}`)
      throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
    }

    const data = await res.arrayBuffer()

    const pathParts = url.split('/')
    const filename = pathParts.pop() || `file-${Date.now()}`
    const folder = pathParts.pop() || ''

    // Prefix filename with folder name to avoid collisions (e.g., men/8.jpg vs women/8.jpg)
    const uniqueName = folder ? `${folder}-${filename}` : filename

    return {
      name: uniqueName,
      data: Buffer.from(data),
      mimetype: `image/${url.split('.').pop()}`,
      size: data.byteLength,
    }
  } catch (e) {
    console.error(`Error fetching file from ${url}, using fallback. Error:`, e)

    // Return a 1x1 transparent PNG as fallback
    const fallbackBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      'base64',
    )

    return {
      name: `fallback-${Date.now()}-${Math.random().toString(36).substring(7)}.png`,
      data: fallbackBuffer,
      mimetype: 'image/png',
      size: fallbackBuffer.length,
    }
  }
}

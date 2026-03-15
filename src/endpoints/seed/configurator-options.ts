import type { Payload, PayloadRequest } from 'payload'

export const seedConfiguratorOptions = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info(`— Seeding configurator options...`)

  const optionsData = [
    // I. Typ Projektu (category: 'type')
    {
      label: 'Wizytówka Firmowa',
      value: 'business_card',
      price: 2500,
      category: 'type',
      description: 'Elegancka strona informacyjna dla Twojej firmy.',
    },
    {
      label: 'Landing Page',
      value: 'landing_page',
      price: 1800,
      category: 'type',
      description: 'Skoncentrowana na konwersji strona docelowa dla kampanii.',
    },
    {
      label: 'Sklep E-commerce',
      value: 'ecommerce',
      price: 6500,
      category: 'type',
      description: 'Pełna platforma sprzedażowa z płatnościami.',
    },
    {
      label: 'Portal / System Dedykowany',
      value: 'portal',
      price: 12000,
      category: 'type',
      description: 'Zaawansowane rozwiązanie szyte na miarę.',
    },

    // II. Skala (category: 'pages')
    { label: '1 Podstrona', value: '1', price: 0, category: 'pages' },
    { label: '2-5 Podstron', value: '2-5', price: 500, category: 'pages' },
    { label: '5-10 Podstron', value: '5-10', price: 1200, category: 'pages' },
    { label: '10+ Podstron', value: '10+', price: 2500, category: 'pages' },

    // III. Design (category: 'design')
    {
      label: 'Profil Standard',
      value: 'standard',
      price: 0,
      category: 'design',
      description: 'Przejrzysty i czysty design oparty o najlepsze praktyki.',
    },
    {
      label: 'Strategic Design',
      value: 'strategic',
      price: 1500,
      category: 'design',
      description: 'Indywidualny projekt UI/UX dopasowany do strategii marki.',
    },
    {
      label: 'Experience (High-End)',
      value: 'experience',
      price: 3500,
      category: 'design',
      description: 'Zaawansowane animacje, interakcje 3D i efekt WOW.',
    },

    // IV. Funkcje (category: 'features')
    { label: 'Blog / Aktualności', value: 'blog', price: 800, category: 'features' },
    { label: 'System Rezerwacji', value: 'booking', price: 1500, category: 'features' },
    { label: 'Wielojęzyczność (i18n)', value: 'i18n', price: 1000, category: 'features' },
    { label: 'Integracja CRM', value: 'crm', price: 1200, category: 'features' },

    // V. SEO & Marketing (category: 'marketing')
    { label: 'Podstawowe SEO', value: 'seo_basic', price: 500, category: 'marketing' },
    { label: 'Analityka (GA4/GTM)', value: 'analytics', price: 400, category: 'marketing' },
    { label: 'Copywriting Treści', value: 'copywriting', price: 1200, category: 'marketing' },

    // VI. Logistyka (category: 'logistics')
    { label: 'Treści od Klienta', value: 'content_client', price: 0, category: 'logistics' },
    { label: 'Treści od Agencji', value: 'content_agency', price: 2000, category: 'logistics' },
    { label: 'Domena i Hosting MDKcraft', value: 'hosting_mdk', price: 100, category: 'logistics' },
  ]

  for (const option of optionsData) {
    try {
      await payload.create({
        collection: 'configurator-options',
        data: option,
        req,
      })
    } catch (err) {
      payload.logger.error(`Failed to seed option ${option.label}: ${err}`)
    }
  }
}

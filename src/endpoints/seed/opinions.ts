import type { Media } from '@/payload-types'
import { Payload, PayloadRequest } from 'payload'

export const seedOpinions = async ({
  payload,
  req,
  media,
}: {
  payload: Payload
  req: PayloadRequest
  media: Media[]
}): Promise<void> => {
  payload.logger.info(`— Seeding opinions (global)...`)

  const opinionsData = [
    {
      name: 'Piotr Wójcik',
      opinion:
        'Zespół MDKCraft jest niezwykle profesjonalny. Zaprojektowali dla nas stronę, która przekroczyła oczekiwania. Ich zrozumienie potrzeb biznesowych jest unikalne na rynku.',
      rating: 5,
      role: 'CEO TechFlow',
    },
    {
      name: 'Karolina Lewandowska',
      opinion:
        'Innowacyjne rozwiązania i pełna elastyczność. Efekt końcowy sprawił, że nasza marka zyskała zupełnie nową, profesjonalną tożsamość online.',
      rating: 5,
      role: 'Marketing Manager',
    },
    {
      name: 'Michał Kaczmarek',
      opinion:
        'Zdecydowanie najlepszy wybór. Ich podejście do architektury systemów i czystość kodu to standard enterprise, którego szukaliśmy.',
      rating: 4,
      role: 'Founder of Pulse',
    },
    {
      name: 'Anna Zielińska',
      opinion:
        'Współpraca przebiegła błyskawicznie. System sprzedaży zoptymalizował nasze zyski o 40% w pierwszym kwartale. Polecam każdemu!',
      rating: 5,
      role: 'E-commerce Specialist',
    },
    {
      name: 'Tomasz Nowak',
      opinion:
        'Doceniam czystość architektury. To nie tylko nowoczesny design, ale przede wszystkim solidny i bezpieczny fundament pod skalowalny biznes.',
      rating: 5,
      role: 'Software Architect',
    },
    {
      name: 'Marta Kowalczyk',
      opinion:
        'Design, który czuje markę. Zespół MDKCraft od razu uchwycił minimalistyczny vibe premium, na którym mi zależało. Perfekcja w każdym pikselu.',
      rating: 5,
      role: 'Art Director',
    },
    {
      name: 'Jakub Mazur',
      opinion:
        'Szybkość działania i dbałość o detale to wizytówka MDKCraft. Nasza nowa aplikacja bankowa zbiera świetne opinie od użytkowników.',
      rating: 5,
      role: 'CTO FinNet',
    },
    {
      name: 'Patrycja Szymańska',
      opinion:
        'Niesamowita atmosfera współpracy. MDKCraft to partner, który słucha i doradza, a nie tylko wykonuje zlecenia. Efekt zapiera dech.',
      rating: 5,
      role: 'Founder of Bloom',
    },
    {
      name: 'Robert Kłos',
      opinion:
        'Optymalizacja procesów przez dedykowane narzędzia stworzone przez MDKCraft skróciła czas operacyjny o połowę. Genialna robota.',
      rating: 5,
      role: 'Director of Logistics',
    },
    {
      name: 'Alicja Bąk',
      opinion:
        'Z perspektywy UX, MDKCraft dostarcza rozwiązania, które są nie tylko piękne, ale przede wszystkim intuicyjne i dostępne dla każdego.',
      rating: 4,
      role: 'UX Researcher',
    },
    {
      name: 'Sebastian Dudek',
      opinion:
        'Portal społecznościowy dla graczy, który zbudowali, wytrzymuje ogromne obciążenia bez najmniejszego laga. To jest ta jakość.',
      rating: 5,
      role: 'E-gaming Enthusiast',
    },
    {
      name: 'Magdalena Król',
      opinion:
        'Praca z MDKCraft to czysta przyjemność. Profesjonalizm w każdym calu i terminowość, która na tym rynku jest rzadkością.',
      rating: 5,
      role: 'Marketing Lead',
    },
    {
      name: 'Paweł Wiśniewski',
      opinion:
        'MDKCraft dowozi projekty, które po prostu zarabiają. Nasz ROI wzrósł o 25% w miesiąc po rebrandingu i wdrożeniu nowej strony.',
      rating: 5,
      role: 'Product Owner',
    },
    {
      name: 'Natalia Woźniak',
      opinion:
        'Minimalizm z klasą. MDKCraft rozumie estetykę nowoczesnego internetu jak nikt inny. Polecam każdemu domowi mody.',
      rating: 5,
      role: 'Creative Director',
    },
  ]

  // Prepare data for Global - Need to ensure mapping is correct for the fields defined in GlobalConfig
  // The GlobalConfig structure is: { opinions: [ { name, opinion, rating, image, role } ] }
  const formattedOpinions = opinionsData.map((data, i) => {
    const avatar = media[i % media.length]
    return {
      ...data,
      image: avatar.id,
    }
  })

  // Update Global
  payload.logger.info(`— Seeding opinions with ${formattedOpinions.length} items`)

  await payload.updateGlobal({
    slug: 'opinions', // This matches the slug in GlobalConfig
    data: {
      opinions: formattedOpinions,
    },
    req,
  })
}

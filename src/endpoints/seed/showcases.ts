import type { Media, Showcase } from '@/payload-types'
import { Payload, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'
import {
  TECH_POOL,
  pseudoRandom,
} from '../../app/(app)/(pages)/(unauthenticated)/projectsArchive/data/projects'

// Override imported constants with Polish versions and more variety within this file scope
// Note: We are shadowing the imports for the seed script usage.
// In a real scenario, we might want to update the source file too, but for seeding this is safer/easier.

const PL_TITLES_PREFIX = [
  'Cyfrowy',
  'Kwantowy',
  'Neonowy',
  'Aksamitny',
  'Gwiezdny',
  'Szybki',
  'Inteligentny',
  'Globalny',
  'Lokalny',
  'Przyszły',
  'Innowacyjny',
  'Strategiczny',
  'Mobilny',
  'Chmurowy',
  'Bezpieczny',
  'Zwinny',
  'Elastyczny',
  'Skalowalny',
  'Dynamiczny',
  'Wirtualny',
  'Interaktywny',
  'Kreatywny',
  'Nowoczesny',
  'Zaawansowany',
  'Zintegrowany',
  'Automatyczny',
]

const PL_TITLES_SUFFIX = [
  'System',
  'Interfejs',
  'Hub',
  'Portal',
  'Silnik',
  'Analizator',
  'Kreator',
  'Optymalizator',
  'Nawigator',
  'Architekt',
  'Wizjoner',
  'Strażnik',
  'Katalizator',
  'Akcelerator',
  'Generator',
  'Integrator',
  'Monitor',
  'Eksplorator',
  'Symulator',
  'Konstruktor',
  'Dystrybutor',
  'Agregator',
  'Kalkulator',
  'Inicjator',
  'Transformator',
]

const PL_OVERVIEWS = [
  'Kompleksowa platforma do zarządzania zasobami w chmurze.',
  'Rewolucyjny system e-commerce zintegrowany z AI.',
  'Aplikacja mobilna wspierająca zdrowy tryb życia i monitorowanie postępów.',
  'System bankowości internetowej nowej generacji z naciskiem na bezpieczeństwo.',
  'Platforma edukacyjna oferująca spersonalizowane ścieżki rozwoju.',
  'Narzędzie do automatyzacji marketingu w mediach społecznościowych.',
  'System IoT do monitorowania zużycia energii w inteligentnych domach.',
  'Platforma rezerwacyjna dla branży turystycznej z obsługą blockchain.',
  'Aplikacja do telemedycyny łącząca pacjentów z lekarzami w czasie rzeczywistym.',
  'System logistyczny optymalizujący trasy dostaw przy użyciu uczenia maszynowego.',
  'Portal społecznościowy dla profesjonalistów z branży kreatywnej.',
  'Narzędzie analityczne dla sektora finansowego przewidujące trendy rynkowe.',
  'Platforma streamingowa oferująca interaktywne treści wideo.',
  'System zarządzania flotą pojazdów z funkcją predykcji awarii.',
  'Aplikacja do zarządzania projektami z wbudowanym asystentem głosowym.',
]

const PL_CHALLENGES = [
  'Wysokie koszty utrzymania infrastruktury i niska skalowalność.',
  'Trudności w integracji z istniejącymi systemami legacy.',
  'Niska konwersja użytkowników i wysoki współczynnik odrzuceń.',
  'Problemy z bezpieczeństwem danych i zgodnością z RODO.',
  'Brak spójności wizualnej i słabe doświadczenia użytkownika (UX).',
  'Powolne działanie aplikacji przy dużym obciążeniu.',
  'Brak automatyzacji procesów biznesowych powodujący błędy ludzkie.',
  'Trudności w analizie dużych zbiorów danych w czasie rzeczywistym.',
  'Ograniczona dostępność usług na urządzeniach mobilnych.',
  'Wysoki koszt pozyskania klienta i niska retencja.',
  'Złożony proces wdrażania nowych funkcji i aktualizacji.',
  'Brak personalizacji oferty dla klientów końcowych.',
]

const PL_SOLUTIONS = [
  'Wdrożenie architektury mikroserwisów opartej na Kubernetes.',
  'Stworzenie dedykowanego interfejsu API z wykorzystaniem GraphQL.',
  'Zastosowanie zaawansowanych algorytmów AI do rekomendacji produktów.',
  'Przeprojektowanie interfejsu użytkownika zgodnie z zasadami Material Design.',
  'Migracja danych do chmury obliczeniowej AWS z auto-scalingiem.',
  'Wdrożenie systemu CI/CD do automatyzacji procesów wytwórczych.',
  'Integracja z systemami płatności mobilnych i portfelami cyfrowymi.',
  'Zastosowanie technologii blockchain do zapewnienia transparentności transakcji.',
  'Stworzenie progresywnej aplikacji internetowej (PWA) dla lepszej dostępności.',
  'Wdrożenie narzędzi analitycznych BI do monitorowania KPI.',
  'Opracowanie systemu design system dla spójności marki.',
  'Implementacja chatbota opartego na NLP do obsługi klienta.',
]

const PL_IMPACTS = [
  'Zwiększenie przychodów o 40% w pierwszym kwartale po wdrożeniu.',
  'Redukcja kosztów operacyjnych o 30% dzięki automatyzacji.',
  'Poprawa satysfakcji klientów mierzona wskaźnikiem NPS o 20 punktów.',
  'Skrócenie czasu ładowania strony o 60%, co wpłynęło na SEO.',
  'Zwiększenie liczby aktywnych użytkowników miesięcznie o 50%.',
  'Pełna zgodność z regulacjami prawnymi i standardami bezpieczeństwa.',
  'Przyspieszenie procesu wprowadzania produktów na rynek (Time-to-Market).',
  'Zwiększenie zaangażowania użytkowników w aplikacji o 45%.',
  'Redukcja liczby błędów systemowych o 90%.',
  'Poprawa efektywności zespołu dzięki lepszym narzędziom pracy.',
  'Zwiększenie lojalności klientów i wartości życiowej klienta (LTV).',
  'Otwarcie nowych kanałów sprzedaży i ekspansja na rynki zagraniczne.',
]

const PL_CLIENTS = [
  'Solaris Tech',
  'Nova Bank',
  'Green Energy',
  'Media Star',
  'LogiTrans',
  'EduFuture',
  'MedConnect',
  'SmartHome',
  'CryptoVault',
  'AgroTech',
  'FashionHub',
  'AutoMotive',
  'BuildCorp',
  'FoodExpress',
  'TravelWing',
  'CyberSec',
  'DataMind',
  'EcoSolutions',
  'GameZone',
  'HealthPlus',
]

export const seedShowcases = async ({
  payload,
  req,
  thumbnail,
}: {
  payload: Payload
  req: PayloadRequest
  thumbnail: Media
}): Promise<void> => {
  payload.logger.info(`— Seeding 50 showcases (Polish)...`)

  const count = 50
  const usedSlugs = new Set<string>()
  const projects: RequiredDataFromCollectionSlug<'showcases'>[] = []

  for (let i = 0; i < count; i++) {
    let seed = (i + 1) * 777
    let title = ''
    let slug = ''

    // Generate unique title/slug
    while (true) {
      const title_pre =
        PL_TITLES_PREFIX[Math.floor(pseudoRandom(seed + 1) * PL_TITLES_PREFIX.length)]
      const title_suf =
        PL_TITLES_SUFFIX[Math.floor(pseudoRandom(seed + 2) * PL_TITLES_SUFFIX.length)]
      title = `${title_pre} ${title_suf}`
      slug = title
        .toLowerCase()
        .replace(/ą/g, 'a')
        .replace(/ć/g, 'c')
        .replace(/ę/g, 'e')
        .replace(/ł/g, 'l')
        .replace(/ń/g, 'n')
        .replace(/ó/g, 'o')
        .replace(/ś/g, 's')
        .replace(/ź/g, 'z')
        .replace(/ż/g, 'z')
        .replace(/ /g, '-')

      if (!usedSlugs.has(slug)) {
        usedSlugs.add(slug)
        break
      }
      seed += 13 // Re-roll with different seed if collision occurs
    }

    const client = PL_CLIENTS[Math.floor(pseudoRandom(seed + 3) * PL_CLIENTS.length)]
    const overview = PL_OVERVIEWS[Math.floor(pseudoRandom(seed + 4) * PL_OVERVIEWS.length)]
    const challenge = PL_CHALLENGES[Math.floor(pseudoRandom(seed + 5) * PL_CHALLENGES.length)]
    const solution = PL_SOLUTIONS[Math.floor(pseudoRandom(seed + 6) * PL_SOLUTIONS.length)]
    const impact = PL_IMPACTS[Math.floor(pseudoRandom(seed + 7) * PL_IMPACTS.length)]

    // Select 6 unique tech items
    const selectedTech: any[] = []
    const tempPool = [...TECH_POOL]
    const techCount = 4 + Math.floor(pseudoRandom(seed + 30) * 4) // Varied tech count (4-7)

    for (let j = 0; j < techCount; j++) {
      if (tempPool.length === 0) break
      const idx = Math.floor(pseudoRandom(seed + j + 20) * tempPool.length)
      const tech = tempPool[idx]

      // Get icon name from component or string
      let iconName = 'Box' // Default fallback
      if (typeof tech.icon === 'string') {
        iconName = tech.icon
      } else if (tech.icon && (tech.icon as any).displayName) {
        iconName = (tech.icon as any).displayName
      } else if (tech.icon && (tech.icon as any).name) {
        iconName = (tech.icon as any).name
      }

      selectedTech.push({
        name: tech.name,
        icon: iconName,
        category: tech.category,
        description: tech.description,
      })
      tempPool.splice(idx, 1)
    }

    // Random status
    const statuses: Showcase['status'][] = [
      'completed',
      'completed',
      'completed',
      'in-progress',
      'maintenance',
    ]
    const status = statuses[Math.floor(pseudoRandom(seed + 8) * statuses.length)]

    // Random category
    const categories: Showcase['category'][] = [
      'E-commerce',
      'FinTech',
      'Healthcare',
      'AI/ML',
      'Blockchain',
      'IoT',
      'SaaS',
      'Social',
    ]
    const category = categories[Math.floor(pseudoRandom(seed + 9) * categories.length)]

    projects.push({
      title,
      slug,
      client,
      tagline: `Rozwiązanie ${category.toLowerCase()} nowej generacji dla ery cyfrowej.`,
      year: (2021 + (i % 5)).toString(),
      category,
      status,
      description: {
        overview,
        challenge,
        solution,
        impact,
      },
      thumbnail: thumbnail.id,
      techStack: selectedTech,
      team: [
        {
          name: 'Adam Jensen',
          role: 'Security Architect',
          avatar: '/img/avatars/1.jpg',
          contribution: 'Encryption core.',
        },
        {
          name: 'Molly Millions',
          role: 'Interface Lead',
          avatar: '/img/avatars/2.jpg',
          contribution: 'UI Optimization.',
        },
        {
          name: 'Case',
          role: 'Backend Engineer',
          avatar: '/img/avatars/3.jpg',
          contribution: 'Distributed systems.',
        },
      ],
      milestones: [
        {
          date: 'Sty 2024',
          title: 'Koncepcja',
          description: 'Burza mózgów i wstępne diagramy architektury C4.',
          completed: true,
        },
        {
          date: 'Mar 2024',
          title: 'Rozwój MVP',
          description: 'Główne funkcjonalności zaimplementowane, wczesne testy.',
          completed: true,
        },
        {
          date: 'Cze 2024',
          title: 'Audyt Bezpieczeństwa',
          description: 'Pełne testy penetracyjne i ocena podatności.',
          completed: true,
        },
        {
          date: 'Wrz 2024',
          title: 'Start Publiczny',
          description: 'Dostępne globalnie we wszystkich regionach.',
          completed: status === 'completed',
        },
      ],
      stats: {
        commits: 1200 + Math.floor(pseudoRandom(seed + 10) * 8000),
        hoursSpent: 500 + Math.floor(pseudoRandom(seed + 11) * 3000),
        performanceScore: 92 + Math.floor(pseudoRandom(seed + 12) * 8),
        uptime: '99.99%',
        users: `${10 + Math.floor(pseudoRandom(seed + 13) * 500)}k`,
      },
      links: {
        live: 'https://mdkcraft.pl',
        github: 'https://github.com/mdkcraft',
        caseStudy: '#',
      },
      features: [
        {
          title: 'Wydajność Edge',
          description: 'Czas odpowiedzi poniżej jednej milisekundy globalnie.',
        },
        {
          title: 'Bezpieczeństwo Zero Trust',
          description: 'Kryptograficzna weryfikacja tożsamości przy każdym żądaniu.',
        },
        {
          title: 'Analityka Real-time',
          description: 'Natychmiastowe pętle zwrotne dla decyzji opartych na danych.',
        },
      ],
      techDetails: {
        architecture: 'Mikroserwisy z service mesh',
        language: 'Rust / TypeScript',
        database: 'PostgreSQL / Redis',
        hosting: 'Vercel / AWS',
      },
      testimonial: {
        quote: `Wdrożenie ${title} było punktem zwrotnym dla naszej strategii cyfrowej. Wyniki mówią same za siebie.`,
        author: 'Anna Z.',
        role: 'CTO w ' + client,
      },
      theme: {
        primary: `#${Math.floor(pseudoRandom(seed + 14) * 16777215)
          .toString(16)
          .padStart(6, '0')}`,
      },
    })
  }

  await Promise.all(
    projects.map((project) =>
      payload.create({
        collection: 'showcases',
        data: project,
        req,
      }),
    ),
  )
}

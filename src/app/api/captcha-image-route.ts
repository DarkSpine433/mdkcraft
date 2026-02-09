// app/api/captcha/images/[category]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

/**
 * API endpoint do serwowania obrazków CAPTCHA
 * W produkcji: Zintegruj z prawdziwą bazą obrazków lub usługą typu Cloudinary
 */

// Symulowane kategorie obrazków z przykładowymi danymi
const IMAGE_CATEGORIES = {
  traffic_lights: {
    name: 'Światła drogowe',
    // W produkcji: prawdziwe URL-e do obrazków
    images: [
      { hasObject: true, url: '/images/captcha/traffic_lights/1.jpg' },
      { hasObject: false, url: '/images/captcha/traffic_lights/2.jpg' },
      { hasObject: true, url: '/images/captcha/traffic_lights/3.jpg' },
      { hasObject: false, url: '/images/captcha/traffic_lights/4.jpg' },
      { hasObject: true, url: '/images/captcha/traffic_lights/5.jpg' },
      { hasObject: false, url: '/images/captcha/traffic_lights/6.jpg' },
      { hasObject: false, url: '/images/captcha/traffic_lights/7.jpg' },
      { hasObject: true, url: '/images/captcha/traffic_lights/8.jpg' },
      { hasObject: false, url: '/images/captcha/traffic_lights/9.jpg' },
    ],
  },
  crosswalks: {
    name: 'Przejścia dla pieszych',
    images: [
      { hasObject: true, url: '/images/captcha/crosswalks/1.jpg' },
      { hasObject: true, url: '/images/captcha/crosswalks/2.jpg' },
      { hasObject: false, url: '/images/captcha/crosswalks/3.jpg' },
      { hasObject: false, url: '/images/captcha/crosswalks/4.jpg' },
      { hasObject: true, url: '/images/captcha/crosswalks/5.jpg' },
      { hasObject: false, url: '/images/captcha/crosswalks/6.jpg' },
      { hasObject: false, url: '/images/captcha/crosswalks/7.jpg' },
      { hasObject: false, url: '/images/captcha/crosswalks/8.jpg' },
      { hasObject: true, url: '/images/captcha/crosswalks/9.jpg' },
    ],
  },
  bicycles: {
    name: 'Rowery',
    images: Array.from({ length: 9 }, (_, i) => ({
      hasObject: Math.random() > 0.6,
      url: `/images/captcha/bicycles/${i + 1}.jpg`,
    })),
  },
  buses: {
    name: 'Autobusy',
    images: Array.from({ length: 9 }, (_, i) => ({
      hasObject: Math.random() > 0.6,
      url: `/images/captcha/buses/${i + 1}.jpg`,
    })),
  },
  bridges: {
    name: 'Mosty',
    images: Array.from({ length: 9 }, (_, i) => ({
      hasObject: Math.random() > 0.6,
      url: `/images/captcha/bridges/${i + 1}.jpg`,
    })),
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
) {
  const { category, id } = params
  const { searchParams } = new URL(request.url)
  const isThumbnail = searchParams.get('thumb') === 'true'

  // Walidacja kategorii
  if (!(category in IMAGE_CATEGORIES)) {
    return NextResponse.json(
      { error: 'Invalid category' },
      { status: 400 }
    )
  }

  const imageIndex = parseInt(id)
  if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= 9) {
    return NextResponse.json(
      { error: 'Invalid image ID' },
      { status: 400 }
    )
  }

  // W produkcji: Zwróć prawdziwy obrazek
  // Tutaj: Zwracamy placeholder SVG
  const svg = generatePlaceholderSVG(category, imageIndex, isThumbnail)

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

/**
 * Generuje placeholder SVG dla celów demonstracyjnych
 * W produkcji: Zamień to na prawdziwe obrazki
 */
function generatePlaceholderSVG(
  category: string,
  imageIndex: number,
  isThumbnail: boolean
): string {
  const size = isThumbnail ? 150 : 300
  const colors = [
    '#1e293b', '#334155', '#475569', '#64748b',
    '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9'
  ]
  const color = colors[imageIndex % colors.length]

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${color}"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="${isThumbnail ? '12' : '16'}"
        fill="#ffffff"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${category}-${imageIndex}
      </text>
      <text
        x="50%"
        y="65%"
        font-family="Arial, sans-serif"
        font-size="${isThumbnail ? '10' : '12'}"
        fill="#94a3b8"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${isThumbnail ? 'thumb' : 'full'}
      </text>
    </svg>
  `.trim()
}

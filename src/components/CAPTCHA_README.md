# 🔐 Zaawansowany System CAPTCHA

Profesjonalny, wielowarstwowy system weryfikacji CAPTCHA z analizą behawioralną, biometryczną i środowiskową.

## 🎯 Funkcje

### 1. **Trzy Tryby Weryfikacji**

#### 🎚️ Slider CAPTCHA (Poziom 1)
- Analiza trajektorii ruchu myszy
- Wykrywanie mikro-ruchów charakterystycznych dla ludzi
- Analiza krzywizny i wariancji prędkości
- Pomiar nacisku (pressure) dla urządzeń dotykowych

#### 🖼️ Image Challenge (Poziom 2)
- Wybór obrazków zawierających określone obiekty
- Analiza wzorca kliknięć (timing, kolejność)
- Wykrywanie sekwencyjnego klikania (typowe dla botów)
- Pomiar czasu spędzonego na wyzwaniu

#### 🔢 Math Challenge (Poziom 3)
- Proste równania matematyczne
- Weryfikacja czasu odpowiedzi
- Analiza wzorca interakcji

### 2. **Zaawansowane Wykrywanie Botów**

#### Device Fingerprinting
```typescript
{
  webdriver: boolean,           // Wykrywa Selenium/Puppeteer
  screenRes: string,            // Analiza rozdzielczości
  plugins: number,              // Headless browsers = 0 pluginów
  touchPoints: number,          // Weryfikacja spójności urządzenia
  platform: string,             // OS i przeglądarka
  userAgent: string,            // Analiza User Agent
  languages: string[],          // Wykrywa nietypowe ustawienia
  timezone: string,             // Weryfikacja strefy czasowej
  cookieEnabled: boolean,       // Sprawdzenie cookies
  doNotTrack: string | null     // DNT header
}
```

#### Behavioral Analysis
- **Velocity Variance**: Ludzie nie poruszają się ze stałą prędkością
- **Curvature Analysis**: Ludzie robią płynne łuki, nie proste linie
- **Micro-movements**: Drobne korekty charakterystyczne dla ludzi
- **Pressure Analysis**: Zmienny nacisk przy urządzeniach dotykowych
- **Click Patterns**: Analiza odstępów czasowych między kliknięciami

#### Timing Analysis
- Czas od załadowania strony do pierwszej interakcji
- Czas wypełniania formularza
- Zbyt szybkie wypełnienie = podejrzane
- Zbyt długie wypełnienie = możliwy bot

### 3. **Honeypot Field**
Ukryte pole, które wypełniają tylko boty:
```tsx
<input
  type="text"
  className="absolute -left-[9999px]"
  tabIndex={-1}
  autoComplete="off"
/>
```

### 4. **Trust Score System**
System punktowy (0-100) bazujący na:
- Poprawność odpowiedzi CAPTCHA
- Naturalność ruchu myszy
- Wiarygodność fingerprinta urządzenia
- Timing analysis
- Brak flag bezpieczeństwa

## 📦 Instalacja

### 1. Skopiuj pliki do projektu

```bash
# Server action
app/actions/verifyCaptcha.ts

# React component
components/AdvancedCaptcha.tsx

# Updated contact form
components/ContactForm.tsx

# API route (opcjonalny - dla prawdziwych obrazków)
app/api/captcha/images/[category]/[id]/route.ts
```

### 2. Zainstaluj zależności

```bash
npm install framer-motion lucide-react
# lub
pnpm add framer-motion lucide-react
```

### 3. Konfiguracja

W `next.config.js`:
```javascript
module.exports = {
  experimental: {
    serverActions: true,
  },
}
```

## 🚀 Użycie

### Podstawowe użycie

```tsx
import { AdvancedCaptcha, useAdvancedCaptcha } from '@/components/AdvancedCaptcha'

function MyForm() {
  const { captchaToken, isVerified, handleVerify, handleError } = useAdvancedCaptcha()

  return (
    <form>
      {/* Twoje pola formularza */}
      
      <AdvancedCaptcha 
        onVerify={handleVerify}
        onError={handleError}
        mode="auto" // lub 'slider', 'image', 'math'
      />
      
      <button disabled={!isVerified}>
        Wyślij
      </button>
    </form>
  )
}
```

### Tryby weryfikacji

```tsx
// Auto - automatycznie zwiększa trudność przy niepowodzeniu
<AdvancedCaptcha mode="auto" />

// Tylko slider
<AdvancedCaptcha mode="slider" />

// Tylko wyzwanie obrazkowe
<AdvancedCaptcha mode="image" />

// Tylko wyzwanie matematyczne
<AdvancedCaptcha mode="math" />
```

### Hook API

```typescript
const {
  captchaToken,      // Token do wysłania na backend
  captchaError,      // Błąd weryfikacji
  trustScore,        // Wynik zaufania (0-100)
  isVerified,        // Boolean - czy zweryfikowano
  handleVerify,      // Callback po udanej weryfikacji
  handleError,       // Callback przy błędzie
  resetCaptcha,      // Reset stanu
} = useAdvancedCaptcha()
```

## 🔒 Backend Verification

### Weryfikacja tokenu

```typescript
import { verifyCaptcha, validateToken } from '@/app/actions/verifyCaptcha'

// W API route
export async function POST(request: Request) {
  const { captchaToken, ...formData } = await request.json()
  
  // Waliduj token
  const isValid = await validateToken(captchaToken)
  
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid CAPTCHA token' },
      { status: 400 }
    )
  }
  
  // Przetwarzaj formularz...
}
```

## 🎨 Customizacja

### Styling

Komponent używa Tailwind CSS. Możesz dostosować kolory:

```tsx
// W AdvancedCaptcha.tsx
<motion.div
  className="bg-gradient-to-br from-primary via-purple-600 to-pink-600"
  // Zmień na swoje kolory
/>
```

### Dodanie własnych wyzwań

```typescript
// W verifyCaptcha.ts
export async function generateCustomChallenge() {
  // Twoja logika generowania wyzwania
  return {
    challengeId: crypto.randomBytes(16).toString('hex'),
    // ... inne dane
  }
}
```

## 🛡️ Bezpieczeństwo

### Best Practices

1. **Rate Limiting**: Ogranicz liczbę prób weryfikacji
```typescript
// Przykład z Redis
const attempts = await redis.incr(`captcha:attempts:${ip}`)
if (attempts > 5) {
  return { error: 'Too many attempts' }
}
await redis.expire(`captcha:attempts:${ip}`, 3600)
```

2. **Token Expiration**: Tokeny wygasają po 10 minutach
```typescript
expiresAt: Date.now() + 10 * 60 * 1000
```

3. **Przechowywanie wyzwań**: W produkcji użyj Redis zamiast in-memory
```typescript
// Zamiast Map
const activeChallenges = new Map()

// Użyj Redis
await redis.setex(`challenge:${id}`, 300, JSON.stringify(data))
```

4. **HTTPS**: Zawsze używaj HTTPS w produkcji

### Ochrona przed atakami

- ✅ Wykrywanie headless browsers (Puppeteer, Selenium)
- ✅ Analiza fingerprinta urządzenia
- ✅ Honeypot fields
- ✅ Timing analysis
- ✅ Behavioral biometrics
- ✅ Multi-factor verification

## 📊 Metryki

### Trust Score Breakdown

```
100 punktów bazowych - różne testy odejmują punkty:

- Webdriver wykryty: -50 pkt
- Brak pluginów: -20 pkt
- Nienaturainy timing: -30 pkt
- Mechaniczny ruch myszy: -30 pkt
- Brak mikro-ruchów: -20 pkt
- Sekwencyjne klikanie: -35 pkt
- Zbyt szybkie rozwiązanie: -25 pkt

Próg akceptacji: 40 punktów
```

## 🔧 Troubleshooting

### Problem: CAPTCHA zawsze się nie udaje

**Rozwiązanie**: Sprawdź ustawienia przeglądarki:
- Czy cookies są włączone?
- Czy JavaScript jest włączony?
- Czy to nie headless browser?

### Problem: Image Challenge nie ładuje obrazków

**Rozwiązanie**: 
1. Sprawdź API route dla obrazków
2. Upewnij się, że ścieżki są poprawne
3. W produkcji: użyj CDN (Cloudinary, AWS S3)

### Problem: Niski Trust Score

**Rozwiązanie**:
- Sprawdź logi `result.details.warnings`
- Dostosuj progi w funkcji `verifyCaptcha`
- Rozważ zmniejszenie wymagań dla urządzeń mobilnych

## 📈 Produkcja

### Integracja z prawdziwymi obrazkami

```typescript
// Użyj Cloudinary lub innej usługi
const images = await cloudinary.api.resources({
  type: 'upload',
  prefix: 'captcha/traffic_lights',
  max_results: 100,
})
```

### Redis dla wyzwań

```typescript
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)

// Zapisz wyzwanie
await redis.setex(
  `challenge:${challengeId}`,
  300, // 5 minut
  JSON.stringify(challengeData)
)

// Pobierz wyzwanie
const data = await redis.get(`challenge:${challengeId}`)
```

### Monitoring i Analytics

```typescript
// Śledź statystyki
await analytics.track('captcha_attempt', {
  mode: 'image',
  success: result.verified,
  trustScore: result.trustScore,
  attempts: attemptCount,
})
```

## 📝 Licencja

MIT - Możesz używać, modyfikować i dystrybuować ten kod.

## 🤝 Wsparcie

Masz pytania? Otwórz issue lub napisz na: support@twojadomena.pl

---

**Wersja**: 1.0.0  
**Ostatnia aktualizacja**: 2025  
**Kompatybilność**: Next.js 14+, React 18+

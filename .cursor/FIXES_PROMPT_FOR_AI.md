# Prompt dla AI: Analiza codebase MDKcraft i lista do naprawy

## Kontekst projektu

- **Stack:** Next.js 15 (App Router), Payload CMS 3.75, MongoDB, TypeScript, Stripe (ecommerce plugin).
- **Struktura:** Aplikacja ma sekcję publiczną (landing, kontakt), panel zalogowanego użytkownika pod `/dashboard` oraz kolekcje Payload (Users, Projects, Tickets, Notifications, ClientFiles, Orders z pluginu ecommerce, itd.).
- **Język UI:** Polski.

---

## 1. KRYTYCZNE: Błędne URL i przekierowania (404)

### 1.1 Nieistniejąca ścieżka `/account/dashboard`

- **Fakt:** W App Routerze istnieje tylko:
  - `(dashboard)/dashboard/page.tsx` → URL: **`/dashboard`**
  - `(dashboard)/account/page.tsx` → URL: **`/account`**
  - Nie ma pliku `account/dashboard/page.tsx`, więc **`/account/dashboard` zwraca 404**.

- **Gdzie jest używane `/account/dashboard`:**
  - `src/app/(app)/(pages)/(authenticated)/(dashboard)/dashboard/page.tsx` – `redirect(/login?redirect=...)` wskazuje na `/account/dashboard`.
  - `src/app/actions/stripe.ts` – `success_url` i `return_url` ustawione na `.../account/dashboard`.
  - `src/components/forms/LoginForm/index.tsx` – po logowaniu: `router.push('/account/dashboard')`.
  - `src/components/forms/CreateAccountForm/index.tsx` – po rejestracji przekierowanie na `/account/dashboard?...`.
  - `src/components/forms/TicketForm/index.tsx` – po utworzeniu zgłoszenia: `router.push('/account/dashboard?success=...')`.

**Zadanie:** We wszystkich tych miejscach zamienić **`/account/dashboard`** na **`/dashboard`** (albo dodać route `account/dashboard` jako redirect do `dashboard` – wtedy zachowasz spójność z „account” w nazwie).

---

## 2. Strona „Zamówienia” i brakująca strona `/shop`

### 2.1 Link „Rozpocznij nowy projekt” prowadzi do `/shop`

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/orders/page.tsx`
- **Problem:** Przy braku zamówień użytkownik dostaje przycisk z `href="/shop"`. W projekcie **nie ma zdefiniowanej trasy `/shop`** (brak `app/.../shop/page.tsx` w strukturze frontu).
- **Zadanie:** Albo dodać stronę `/shop` (np. listę produktów z ecommerce), albo zmienić link na istniejącą stronę (np. `/kontakt`, `/dashboard`, lub inną docelową).

### 2.2 Pobieranie zamówień z `limit: 0`

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/orders/page.tsx`
- **Kod:** `payload.find({ collection: 'orders', limit: 0, ... })`.
- **Problem:** W Payload `limit: 0` może oznaczać „zwróć 0 dokumentów”, więc lista zamówień może być zawsze pusta.
- **Zadanie:** Ustaw sensowny limit (np. `limit: 50`) lub użyj paginacji; usuń `limit: 0` jeśli intencją było „wszystkie”.

---

## 3. Powiadomienia – logika serwerowa

### 3.1 Strona powiadomień bez wymagania logowania

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/notifications/page.tsx`
- **Problem:** Strona wykonuje `payload.find` na kolekcji `notifications` z `recipient: { equals: user?.id }`. Gdy użytkownik nie jest zalogowany (`user === null`), zapytanie może być niejednoznaczne (np. `equals: undefined`), a strona i tak się renderuje – brak `redirect('/login')` jak na innych podstronach dashboardu.
- **Zadanie:** Dodać na początku strony (po `payload.auth`) warunek: jeśli `!user`, wykonać `redirect('/login')` (ew. z `?redirect=/notifications`).

### 3.2 Oznaczanie wszystkich powiadomień jako przeczytane (bulk update)

- **Plik:** `src/app/actions/dashboard.ts`, funkcja `markAllNotificationsAsRead`.
- **Problem:** Wywołanie `payload.update({ collection: 'notifications', where: { ... }, data: { isRead: true } })`. W Payload CMS Local API metoda **`update`** zwykle przyjmuje **pojedyncze `id`**, a nie `where` (bulk update). To może powodować błąd w runtime lub brak aktualizacji.
- **Zadanie:** Zaimplementować „oznacz wszystkie jako przeczytane” przez:
  - `payload.find` z odpowiednim `where` (np. osobowe + broadcasty nieprzeczytane),
  - pętlę po `docs` i `payload.update({ collection: 'notifications', id: doc.id, data: { ... } })` dla każdego dokumentu,
  - lub sprawdzić w dokumentacji Payload 3, czy istnieje oficjalne `updateByWhere` / bulk update i użyć tego.

---

## 4. Projekty – UI bez podłączenia do logiki

### 4.1 Lista projektów – wyszukiwarka i filtr

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/projects/page.tsx`
- **Problem:** Input „SZUKAJ PROJEKTU...” i przycisk „Filtruj” nie mają `value`/`onChange`, nie wywołują żadnej akcji serwerowej ani `searchParams`. Lista projektów jest pobierana raz na serwerze bez uwzględnienia wyszukiwania/filtrowania.
- **Zadanie:** Dodać wyszukiwanie (np. po tytule) i opcjonalnie filtr (np. status):
  - albo przez `searchParams` (np. `?q=...&status=...`) i odczyt w server component + `payload.find` z `where` (np. `title: { contains: q }`, `status: { equals: status }`),
  - albo przez client component z formularzem wyszukiwania, który ustawia `router.push('/projects?q=...')` i odświeża.

### 4.2 Karty projektów – zahardkodowane dane

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/projects/page.tsx`
- **Problem:** W kartach projektów:
  - Opis: zawsze tekst „Brak opisu projektu.” zamiast `project.description`.
  - „Ostatnia Zmiana”: zahardkodowane „24h Temu” zamiast np. `updatedAt` / `activityLog[0].date`.
  - „Postęp”: zahardkodowane „75% Gotowe” zamiast `project.progress`.
- **Zadanie:** Podłączyć do danych z Payload: `description` (np. z richText), ostatnia zmiana z `updatedAt` lub ostatniego wpisu w `activityLog`, postęp z `project.progress`.

### 4.3 Szczegóły projektu – przycisk „Zarządzaj Planem”

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/projects/[slug]/page.tsx`
- **Problem:** Przycisk „Zarządzaj Planem” w sekcji „Szczegóły Subskrypcji” nie ma `onClick` ani `href` – nic nie robi.
- **Zadanie:** Podłączyć akcję (np. przekierowanie do Stripe Customer Portal jak na dashboardzie, lub do `/settings`, lub do dedykowanej strony subskrypcji).

### 4.4 Bezpieczeństwo – fallback po ID w szczegółach projektu

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/projects/[slug]/page.tsx`
- **Problem:** Gdy projekt nie zostanie znaleziony po `slug`, kod wywołuje `payload.findByID({ collection: 'projects', id: slug })` **bez przekazania `user` i `overrideAccess: false`**. To może pozwolić na odczyt projektu innego klienta, jeśli ktoś odgadnie ID.
- **Zadanie:** Po `findByID` (albo zamiast niego) zawsze filtrować po `client: user.id` lub wywołać `findByID` z kontekstem użytkownika i sprawdzić, czy zwrócony dokument należy do `user.id`. Nie pokazywać projektu, jeśli nie należy do zalogowanego użytkownika.

---

## 5. Pliki (Files) – wyszukiwarka i przycisk akcji

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/files/page.tsx`
- **Problem:**
  - Input „SZUKAJ W PLIKACH...” nie jest podłączony do żadnego stanu ani zapytania – brak filtrowania po nazwie/opisie.
  - Przycisk z ikoną `MoreVertical` (akcje) nie ma `onClick` ani menu – nie wykonuje żadnej akcji.
- **Zadanie:** Dodać wyszukiwanie (np. `searchParams` + filtrowanie po `filename`/`description` w `payload.find`) oraz dla „Akcje” – menu (np. „Pobierz”, „Info”) lub usunąć przycisk, jeśli akcje nie są potrzebne.

---

## 6. Ustawienia / Prywatność – przyciski bez akcji

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/settings/privacy/page.tsx`
- **Problem:** Dwa przyciski na dole strony nie mają podłączonej logiki:
  - „Eksportuj Dane (JSON)” – brak eksportu danych użytkownika.
  - „Usuń Prywatne Informacje” – brak akcji (anonymizacja / usunięcie danych).
- **Zadanie:** Zaimplementować (np. server actions):
  - Eksport: pobranie danych użytkownika (z Payload, z zachowaniem RODO), wygenerowanie JSON, zwrócenie pliku do pobrania (np. `Response` z `Content-Disposition: attachment`).
  - Usunięcie/anonymizacja: zgodnie z polityką (np. anonimizacja pól w `users`, usunięcie powiązań) – tylko po potwierdzeniu (np. modal + hasło).

---

## 7. Dashboard – spójność nagłówka tabeli z wierszami (Tickets)

- **Plik nagłówka tabeli:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/dashboard/page.tsx` (thead).
- **Plik wiersza:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/dashboard/TicketsRow.tsx` (tr z td).
- **Problem:** Kolejność kolumn w thead: „Status”, „Temat Zgłoszenia”, „Priorytet”, „Data Utworzenia”. W `TicketsRow` kolejność td to: **Temat (subject), Status, Priorytet, Data**. Czyli Status i Temat są zamienione miejscami – tabela wygląda niespójnie.
- **Zadanie:** Uporządkować kolejność: albo zmienić thead na (Temat, Status, Priorytet, Data), albo zmienić kolejność `<td>` w `TicketsRow` na (Status, Temat, Priorytet, Data), tak aby nagłówek i komórki się zgadzały.

---

## 8. Stripe / Billing – brak obsługi błędów w formularzu

- **Plik:** `src/app/(app)/(pages)/(authenticated)/(dashboard)/dashboard/page.tsx`
- **Problem:** Formularz „Biling i Subskrypcja” wywołuje `getStripeCustomerPortalUrl()` w server action i `redirect(url)`. W `catch` jest tylko `console.error(err)` – użytkownik nie dostaje komunikatu (np. toast), gdy brak `stripeCustomerID` lub wystąpi błąd Stripe.
- **Zadanie:** Zwracać z server action wynik (np. `{ url?: string, error?: string }`) i na froncie wyświetlać błąd (toast/snackbar) lub przekierować tylko gdy `url` jest zwrócone; w przeciwnym razie pokazać „Skontaktuj się z supportem” lub podobny komunikat.

---

## 9. Notifications – dostęp bez zalogowania (layout)

- **Fakt:** Strona `/notifications` znajduje się w folderze `(authenticated)/(dashboard)`, więc teoretycznie layout nadrzędny może wymagać logowania. W pliku `src/app/(app)/(pages)/(authenticated)/layout.tsx` jest `if (!user) redirect('/login')`, więc niezalogowani i tak powinni być przekierowani. Mimo to w samej stronie `notifications/page.tsx` zapytanie używa `user?.id` – warto dla jasności na początku strony dodać jawne `if (!user) redirect(...)` i w zapytaniu używać `user.id` (bez optional chaining), aby uniknąć pomyłek przy refaktoryzacji layoutu.

---

## 10. Podsumowanie zadań (checklist dla AI)

1. **URL:** Zamienić wszystkie odwołania do `/account/dashboard` na `/dashboard` (lub dodać redirect).
2. **Orders:** Naprawić `limit: 0` w `orders/page.tsx`; zmienić link „Rozpocznij nowy projekt” z `/shop` na działającą stronę lub dodać `/shop`.
3. **Notifications:** Dodać `redirect('/login')` gdy `!user`; przepisać `markAllNotificationsAsRead` na pętlę po dokumentach (lub oficjalny bulk update Payload).
4. **Projects:** Podłączyć wyszukiwarkę i filtr; wyświetlać `description`, `updatedAt`/activityLog, `progress`; podłączyć przycisk „Zarządzaj Planem”; zabezpieczyć `findByID` po `slug` (weryfikacja `client === user.id`).
5. **Files:** Podłączyć wyszukiwarkę; dodać akcje do przycisku „Akcje” lub go usunąć.
6. **Privacy:** Zaimplementować „Eksportuj Dane (JSON)” i „Usuń Prywatne Informacje” (server actions + potwierdzenie).
7. **Dashboard tickets:** Zgodna kolejność kolumn (thead vs TicketsRow).
8. **Stripe portal:** Obsługa błędów i komunikatów dla użytkownika zamiast tylko `console.error`.

---

## 11. Dodatkowe uwagi techniczne

- **Payload:** Przy wywołaniach Local API z kontekstem użytkownika (np. `payload.find(..., { user, overrideAccess: false })`) zawsze używaj `overrideAccess: false`, gdy przekazujesz `user` (zgodnie z AGENTS.md).
- **Kolekcja Orders:** Pochodzi z `@payloadcms/plugin-ecommerce` – nie jest w `payload.config.ts` ręcznie; typy są w `payload-types.ts`.
- **User.settings:** Formularz ustawień (`SettingsForm`) zapisuje przez `updateUserSettings` w `app/actions/dashboard.ts` – upewnij się, że schemat `Users` zawiera pole `settings` (obiekt/group) z polami takimi jak `newsletter`, `marketing`, `fontSize`, `layoutDensity`, `animationSpeed`, `glassIntensity`.
- **Routing:** Grupy route `(app)`, `(pages)`, `(authenticated)`, `(dashboard)` nie wchodzą do URL; faktyczne ścieżki to np. `/dashboard`, `/account`, `/orders`, `/notifications`, `/projects`, `/projects/new`, `/projects/[slug]`, `/files`, `/settings`, `/settings/privacy`, `/tickets`, `/tickets/new`, `/login`, `/create-account`.

Po wykonaniu powyższych kroków aplikacja będzie miała spójne przekierowania, działające wyszukiwanie/filtry, poprawne bulk operacje na powiadomieniach, zabezpieczony dostęp do projektów oraz działające przyciski i eksport/usuń w ustawieniach prywatności.

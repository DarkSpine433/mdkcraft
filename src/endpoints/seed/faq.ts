import { Payload, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'

export const seedFaq = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info(`— Seeding FAQ...`)

  const faqData: RequiredDataFromCollectionSlug<'faq'>[] = [
    {
      question: 'Czy oferujecie wsparcie po wdrożeniu?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Tak, oferujemy pakiety wsparcia technicznego i utrzymania po zakończeniu projektu.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 'left',
          indent: 0,
          version: 1,
        },
      },
      category: 'general',
    },
    {
      question: 'Jakie są metody płatności?',
      answer: {
        root: {
          type: 'root',
          format: 'left',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'Akceptujemy przelewy bankowe, płatności kartą oraz PayPal.',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
      category: 'billing',
    },
    {
      question: 'Ile czasu trwa realizacja projektu?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Czas realizacji zależy od skali projektu. Proste strony wizytówki to zazwyczaj 2-3 tygodnie, a sklepy e-commerce od 6 tygodni.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 'left',
          indent: 0,
          version: 1,
        },
      },
      category: 'general',
    },
    {
      question: 'Czy mogę edytować treść na stronie samodzielnie?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Oczywiście. Wszystkie nasze strony oparte są o system zarządzania treścią (CMS), który pozwala na łatwą edycję tekstów i zdjęć.',
                  version: 1,
                },
              ],
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 'left',
          indent: 0,
          version: 1,
        },
      },
      category: 'technical',
    },
  ]

  for (const item of faqData) {
    await payload.create({
      collection: 'faq',
      data: item,
      req,
    })
  }
}

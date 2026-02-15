import { PayloadHandler } from 'payload'

/**
 * Handle session initialization
 */
export const sessionHandler: PayloadHandler = async (req) => {
  const { payload } = req
  const data = (await req.json?.()) as Record<string, unknown> | undefined

  if (!data) {
    return Response.json({ error: 'No data provided' }, { status: 400 })
  }

  try {
    const session = await payload.create({
      collection: 'user-sessions',
      // cast to any here because creating with spread is dynamic
      data: {
        ...data,
        sessionStart: (data.sessionStart as string) || new Date().toISOString(),
      } as any,
    })

    return Response.json(session)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`Analytics Session Error: ${message}`)
    return Response.json({ error: message }, { status: 500 })
  }
}

/**
 * Handle event tracking
 */
export const trackHandler: PayloadHandler = async (req) => {
  const { payload } = req
  const data = (await req.json?.()) as
    | { sessionId: string; events: Record<string, unknown>[] }
    | undefined

  if (!data || !data.events || !Array.isArray(data.events)) {
    return Response.json({ error: 'No events provided' }, { status: 400 })
  }

  const { sessionId, events } = data

  try {
    const results = await Promise.all(
      events.map((event) =>
        payload.create({
          collection: 'user-behavior-events',
          // cast to any because event maps to multiple fields dynamically
          data: {
            ...event,
            sessionId,
            timestamp: (event.timestamp as string) || new Date().toISOString(),
          } as any,
        }),
      ),
    )

    // Update session stats (pageViews, etc)
    const pageViews = events.filter((e) => e.eventType === 'page_load').length
    if (pageViews > 0) {
      const sessions = await payload.find({
        collection: 'user-sessions',
        where: {
          sessionId: { equals: sessionId },
        },
        limit: 1,
      })

      if (sessions.docs.length > 0) {
        const session = sessions.docs[0]
        await payload.update({
          collection: 'user-sessions',
          id: session.id,
          data: {
            pageViews: (typeof session.pageViews === 'number' ? session.pageViews : 0) + pageViews,
          },
        })
      }
    }

    return Response.json({ success: true, count: results.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`Analytics Track Error: ${message}`)
    return Response.json({ error: message }, { status: 500 })
  }
}

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import OpinionsClient from './OpinionsClient'

// -----------------------------------------------------------------------------
// SERVER COMPONENT
// -----------------------------------------------------------------------------

const Opinions = async () => {
  const payload = await getPayload({ config: configPromise })

  const globalData = await payload.findGlobal({
    slug: 'opinions',
  })

  const opinions = globalData.opinions || []

  return <OpinionsClient opinions={opinions} />
}

export default Opinions

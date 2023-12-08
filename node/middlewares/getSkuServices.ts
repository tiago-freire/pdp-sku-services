import { ServiceContext } from '@vtex/api'

import { Clients } from '../clients'

const getSkuServices = async (context: ServiceContext<Clients>) => {
  const {
    vtex: {
      route: {
        params: { skuId },
      },
    },
    clients: { catalog },
  } = context

  const skuContext = await catalog.getSkuContext(skuId as string)

  context.set('Cache-Control', 'max-age=86400')
  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', '*')
  context.set('Access-Control-Allow-Credentials', 'true')
  context.set('Access-Control-Allow-Methods', '*')
  context.set('Content-Type', 'application/json')
  context.body = { ...skuContext }
  context.status = 200
}

export default getSkuServices

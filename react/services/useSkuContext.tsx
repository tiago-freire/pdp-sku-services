import { useQuery } from '@tanstack/react-query'
import { useRuntime } from 'vtex.render-runtime'

import type { ApiResponse } from '.'
import { apiRequestFactory } from '.'

type SkuContextResponse = ApiResponse & {
  Services?: [
    {
      Id: number
      ServiceTypeId: number
      Name: string
      Options: [
        {
          Id: number
          Name: string
          Description: string
          PriceName: string
          ListPrice: number
          Price: number
        }
      ]
    }
  ]
}

export const useSkuContext = (skuId?: string) => {
  const { workspace } = useRuntime()

  return useQuery<SkuContextResponse>({
    queryKey: ['skuContext', workspace, skuId],
    queryFn: apiRequestFactory<SkuContextResponse>(
      `/_v/pdp-sku-services/${skuId}?workspace=${workspace}`
    ),
    enabled: !!skuId,
  })
}

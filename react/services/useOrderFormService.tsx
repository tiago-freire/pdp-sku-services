import { useMutation } from '@tanstack/react-query'
import { Item } from 'vtex.order-manager/OrderForm'
import { useRuntime } from 'vtex.render-runtime'

import { ApiResponse, apiRequestFactory } from '.'

type Response = ApiResponse & {
  orderFormId: string
  items: Item[]
}

type MutationArgs = {
  itemIndex: number
  serviceId: number
}

export const useOrderFormService = (orderFormId: string) => {
  const { workspace } = useRuntime()

  const mutationAddService = useMutation({
    mutationFn: async ({ itemIndex, serviceId }: MutationArgs) =>
      apiRequestFactory<Response>(
        `/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/offerings?workspace=${workspace}`,
        'POST',
        { id: serviceId }
      )(),
  })

  const mutationRemoveService = useMutation({
    mutationFn: async ({ itemIndex, serviceId }: MutationArgs) =>
      apiRequestFactory<Response>(
        `/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/offerings/${serviceId}/remove?workspace=${workspace}`,
        'POST',
        { id: serviceId }
      )(),
  })

  return { mutationAddService, mutationRemoveService }
}

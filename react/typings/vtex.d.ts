declare module 'vtex.styleguide'
declare module 'vtex.order-manager/OrderForm' {
  export type OrderForm = {
    id: string
    items: Item[]
  }

  export type BundleItem = {
    id: string
    uniqueId: string
  }

  export type Item = {
    id: string
    uniqueId: string
    quantity: number
    bundleItems: BundleItem[]
  }

  export const useOrderForm: () => {
    orderForm: OrderForm
    setOrderForm: (newOrderForm: Partial<OrderForm>) => void
  }
}

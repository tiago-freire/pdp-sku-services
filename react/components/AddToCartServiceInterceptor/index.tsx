import React, { useMemo, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { usePixel, usePixelEventCallback } from 'vtex.pixel-manager'
import { useProduct } from 'vtex.product-context'
import { Button, Modal } from 'vtex.styleguide'

import {
  useOrderFormService,
  useSkuContext,
  withQueryProvider,
} from '../../services'
import Card from './Card'
import styles from './styles.css'

const messages = defineMessages({
  modalTitle: { id: 'store/service.modal.title' },
  buttonYesPlural: { id: 'store/service.button.yes.plural' },
  buttonYesSingular: { id: 'store/service.button.yes.singular' },
  buttonNo: { id: 'store/service.button.no' },
})

type Props = {
  pixelEventIdOnSelect?: string
}

const CSS_HANDLES = [...Object.keys(styles)]

const BoldMessageWord = (str: string) => (
  <span className="b c-emphasis">{str}</span>
)

const AddToCartServiceInterceptor = (props: Props) => {
  const intl = useIntl()
  const { pixelEventIdOnSelect } = props
  const handles = useCssHandles(CSS_HANDLES)
  const { push } = usePixel()
  const productContext = useProduct()
  const { orderForm } = useOrderForm()
  const orderFormItems = orderForm?.items
  const orderFormId = orderForm?.id
  const selectedItemId = productContext?.selectedItem?.itemId
  const { data: skuContext } = useSkuContext(selectedItemId)
  const skuServices = skuContext?.Services

  const {
    mutationAddService: { mutate: addService },
    mutationRemoveService: { mutate: removeService },
  } = useOrderFormService(orderFormId)

  const [selectedItemInCart, selectedItemIndexInCart] = useMemo(
    () => [
      orderFormItems.find((item) => selectedItemId === item?.id),
      orderFormItems.findIndex((item) => selectedItemId === item?.id),
    ],
    [orderFormItems, selectedItemId]
  )

  const selectedItemIdInCart = selectedItemInCart?.id
  const quantity = selectedItemInCart?.quantity
  const bundleItems = selectedItemInCart?.bundleItems

  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [open, setOpen] = useState(false)

  usePixelEventCallback({
    eventName: 'addToCart',
    handler(e) {
      const [item] = e?.data?.items

      if (
        item.skuId === selectedItemId &&
        selectedItemIdInCart &&
        selectedItemId === selectedItemIdInCart &&
        quantity === 1 &&
        !bundleItems?.length &&
        skuServices?.length
      ) {
        setSelected(new Set())
        setOpen(true)
      }
    },
  })

  if (
    !skuServices?.length ||
    !selectedItemIdInCart ||
    selectedItemId !== selectedItemIdInCart
  ) {
    return null
  }

  const toggleSelected = (id: number) => () => {
    setSelected((current) => {
      const newSelected = new Set(current)

      if (newSelected.has(id)) {
        removeService({ itemIndex: selectedItemIndexInCart, serviceId: id })
        newSelected.delete(id)

        return newSelected
      }

      addService({ itemIndex: selectedItemIndexInCart, serviceId: id })

      return newSelected.add(id)
    })
  }

  const handleSubmit = () => {
    setOpen(false)
    if (selected.size > 0 && pixelEventIdOnSelect) {
      push({ id: pixelEventIdOnSelect })
    }
  }

  return (
    <Modal
      showCloseIcon
      centered
      isOpen={open}
      onClose={() => setOpen(false)}
      title={
        <div className="t-heading-3 tc mb4">
          {intl.formatMessage(messages.modalTitle, { b: BoldMessageWord })}
        </div>
      }
    >
      <div
        className={`flex flex-wrap justify-center ${handles.addToCartInterceptorItems} pv5`}
      >
        {skuServices.map((service) => {
          const [options] = service.Options
          const price = options?.Price
          const serviceItems = options?.Description?.split('/')

          return (
            <Card
              key={service.Id}
              selected={selected.has(service.Id)}
              handleClick={toggleSelected(service.Id)}
              title={service.Name}
              items={serviceItems}
              bottom={<FormattedCurrency value={price} />}
            />
          )
        })}
      </div>
      <div className="flex justify-end mt6">
        <Button variation="primary" onClick={handleSubmit}>
          {selected.size > 0
            ? selected.size > 1
              ? intl.formatMessage(messages.buttonYesPlural)
              : intl.formatMessage(messages.buttonYesSingular)
            : intl.formatMessage(messages.buttonNo)}
        </Button>
      </div>
    </Modal>
  )
}

export default withQueryProvider(AddToCartServiceInterceptor)

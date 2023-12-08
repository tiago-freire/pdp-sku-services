import type { FC, ReactNode } from 'react'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import styles from './styles.css'

type CardProps = {
  title: string
  items: string[]
  bottom: ReactNode
  selected?: boolean
  handleClick?: () => void
}

const CSS_HANDLES = [...Object.keys(styles), 'servicePrice']

const Card: FC<CardProps> = ({
  title,
  items,
  bottom,
  selected,
  handleClick,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const selectedClasses = selected
    ? handles.addToCartInterceptorItemSelected
    : ''

  return (
    <div
      aria-label={title}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick?.()
        }
      }}
      onClick={() => handleClick?.()}
      className={`${handles.addToCartInterceptorItem} ${selectedClasses} flex flex-column justify-between bg-white shadow-hover flex-grow-1 pa6 br3`}
    >
      <div className="t-heading-5 b">{title}</div>
      <ul className={`pl6 ${handles.addToCartInterceptorList}`}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`pl3 pb3 ${handles.addToCartInterceptorListItem}`}
          >
            {item}
          </li>
        ))}
      </ul>
      <div className={`tr fw5 ${handles.servicePrice}`}>{bottom}</div>
    </div>
  )
}

export default Card

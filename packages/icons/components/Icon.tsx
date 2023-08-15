import { FC } from 'react'

import { IconProps } from '../types/interface'

export const Icon: FC<IconProps> = ({
  iconName,
  size,
  color,
  className = '',
  onClick,
}) => {
  const iconSize = () => {
    switch (size) {
      case 'xs':
        return 20
      case 'sm':
        return 24
      case 'md':
        return 28
      case 'lg':
        return 32
      case 'xl':
        return 40

      default:
        return 24
    }
  }

  return (
    <svg
      className={`${className} iconfont`}
      onClick={onClick}
      aria-hidden='true'
      style={{
        color: color ?? '#999',
        fill: color ?? '#999',
        fontSize: iconSize(),
      }}
    >
      <use xlinkHref={`#jingo-${iconName}`}></use>
    </svg>
  )
}

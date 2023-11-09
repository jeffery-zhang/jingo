import { FC } from 'react'

import { Icon } from './Icon'
import { SpecifiedIconProps } from '../types/interface'

export const SearchIcon: FC<SpecifiedIconProps> = ({
  size,
  color,
  className,
  onClick,
}) => {
  return (
    <Icon
      iconName='search'
      size={size}
      color={color}
      className={className}
      onClick={onClick}
    />
  )
}

import { FC } from 'react'

import { Icon } from './Icon'
import { SpecifiedIconProps } from '../types/interface'

export const WarningIcon: FC<SpecifiedIconProps> = ({
  size,
  color,
  className,
  onClick,
}) => {
  return (
    <Icon
      iconName='warning'
      size={size}
      color={color}
      className={className}
      onClick={onClick}
    />
  )
}

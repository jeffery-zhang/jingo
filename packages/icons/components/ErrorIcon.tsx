import { FC } from 'react'

import { Icon } from './Icon'
import { SpecifiedIconProps } from '../types/interface'

export const ErrorIcon: FC<SpecifiedIconProps> = ({
  size,
  color,
  className,
  onClick,
}) => {
  return (
    <Icon
      iconName='error'
      size={size}
      color={color}
      className={className}
      onClick={onClick}
    />
  )
}

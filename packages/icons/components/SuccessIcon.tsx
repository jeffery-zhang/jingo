import { FC } from 'react'

import { Icon } from './Icon'
import { SpecifiedIconProps } from '../types/interface'

export const SuccessIcon: FC<SpecifiedIconProps> = ({
  size,
  color,
  className,
  onClick,
}) => {
  return (
    <Icon
      iconName='success'
      size={size}
      color={color}
      className={className}
      onClick={onClick}
    />
  )
}

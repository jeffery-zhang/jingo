import { FC } from 'react'

import { Icon } from './Icon'
import { SpecifiedIconProps } from '../types/interface'

export const DeleteIcon: FC<SpecifiedIconProps> = ({
  size,
  color,
  className,
  onClick,
}) => {
  return (
    <Icon
      iconName='delete'
      size={size}
      color={color}
      className={className}
      onClick={onClick}
    />
  )
}

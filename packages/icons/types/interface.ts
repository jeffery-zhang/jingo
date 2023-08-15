export enum IconSize {
  'XS' = 'xs',
  'SM' = 'sm',
  'MD' = 'md',
  'LG' = 'lg',
  'XL' = 'xl',
}

export interface IconProps {
  iconName: string
  size?: IconSize
  color?: string
  className?: string
  onClick?: () => void
}

export type SpecifiedIconProps = Omit<IconProps, 'iconName'>

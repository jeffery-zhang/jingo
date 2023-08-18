'use client'

import { FC } from 'react'

export interface IContentProps {
  title?: string
  message: string
  type: 'success' | 'warn' | 'info' | 'error'
}

export const MessageContent: FC<IContentProps> = ({
  title,
  message,
  type = 'info',
}) => {
  return <div className='toast'></div>
}

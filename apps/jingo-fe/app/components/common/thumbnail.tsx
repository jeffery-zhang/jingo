'use client'

import { FC, useState } from 'react'
import Image from 'next/image'
import { PreviewIcon, DeleteIcon } from '@jingo/icons'

import { useGlobalStore } from '@/app/stores/global.store'

interface IProps {
  src: string
  imgShape?: 'rect' | 'rounded' | 'circle'
  onDelete?: (src: string) => void
}

export const Thumbnail: FC<IProps> = ({ src, imgShape = 'rect', onDelete }) => {
  const { setImagePreview } = useGlobalStore((state) => ({
    setImagePreview: state.setImagePreview,
  }))
  const [showCover, setShowCover] = useState<boolean>(false)
  const getShapeClassName = (shape: IProps['imgShape']) => {
    switch (shape) {
      case 'rounded':
        return 'rounded'
      case 'circle':
        return 'rounded-full'
      default:
        return ''
    }
  }

  const onPreview = (src: string) => {
    setImagePreview({
      visible: true,
      src,
    })
  }

  return (
    <div className='relative w-20 h-20'>
      <Image
        src={src}
        fill
        alt='image'
        className={`${getShapeClassName(imgShape)} object-cover z-10`}
      />
      <div
        onMouseEnter={() => setShowCover(true)}
        onMouseLeave={() => setShowCover(false)}
        className={`flex justify-center items-center gap-2
        w-full h-full absolute bg-base-content/20 z-20
        transition-opacity duration-200 opacity-0
        ${showCover && 'opacity-100'}`}
      >
        <PreviewIcon
          className='w-6 h-6 cursor-pointer text-base-300'
          onClick={() => onPreview(src)}
        />
        <DeleteIcon
          className='w-6 h-6 cursor-pointer text-base-300'
          onClick={() => onDelete?.(src)}
        />
      </div>
    </div>
  )
}

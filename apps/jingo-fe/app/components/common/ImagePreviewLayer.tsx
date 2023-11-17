'use client'

import { FC } from 'react'
import Image from 'next/image'

import { useGlobalStore } from '@/app/stores/global.store'

export const ImagePreviewLayer: FC = () => {
  const { imagePreview, setImagePreview } = useGlobalStore((state) => ({
    imagePreview: state.imagePreview,
    setImagePreview: state.setImagePreview,
  }))

  const onHidePreview = () => {
    setImagePreview({
      visible: false,
      src: '',
    })
  }

  return (
    <div
      className={`fixed w-screen h-screen top-0 left-0 bg-base-300/50
      flex justify-center items-center z-30
      ${imagePreview.visible ? '' : 'hidden'}`}
      onClick={onHidePreview}
    >
      {imagePreview.src && imagePreview.visible && (
        <img src={imagePreview.src} alt='preview image' /> // eslint-disable-line
      )}
    </div>
  )
}

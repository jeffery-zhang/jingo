import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import Image from 'next/image'
import { UploadIcon } from '@jingo/icons'

import { batchUpload } from '../../service/common'
import { Thumbnail } from './thumbnail'

export interface IUploadProps {
  value: string[]
  onChange: (fileUrls: string[]) => void
  onError?: (errMsg: string) => void
  size?: number
  type?: string
  multiple?: boolean
}

export interface IUploadImageProps extends Omit<IUploadProps, 'type'> {
  imgShape?: 'rect' | 'rounded' | 'circle'
}

export const Upload: FC<IUploadProps> = ({
  value,
  onChange,
  onError,
  size = 2,
  type = '',
  multiple = false,
}) => {
  const [files, setFiles] = useState<FileList | null>(null)
  const [errMsg, setErrMsg] = useState<string>('')
  const onFileListChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setErrMsg('')
    const fileList = e.target.files
    console.log('onFileListChange---- ', e.target.files)
    if (fileList && fileList.length > 0) {
      const result = validateFilesSize(fileList)
      if (result) {
        setFiles(fileList)
      } else {
        const msg = '文件大小超出限制'
        onError?.(msg)
        setErrMsg(msg)
      }
    }
  }

  const onUpload = async () => {
    if (!files || files.length === 0) return
    console.log('onUpload----- ', files)
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }
    try {
      const { data, success } = await batchUpload(formData)
      if (success) {
        onChange(data)
      }
    } catch (err) {
      const msg = '上传失败'
      onError?.(msg)
      setErrMsg(msg)
    }
  }

  const validateFilesSize = (files: FileList) => {
    const maxSize = size * 1024 * 1024
    return Array.from(files).every((file) => file.size <= maxSize)
  }

  useEffect(() => {
    onUpload()
  }, [files])

  return (
    <div className='form-control w-full max-w-xs'>
      <div className='relative w-24 btn btn-neutral cursor-pointer'>
        <UploadIcon className='w-8 h-8 cursor-pointer' />
        <input
          type='file'
          onChange={onFileListChange}
          className='opacity-0 w-full h-full absolute left-0 top-0 cursor-pointer'
          accept={type}
          multiple={multiple}
        />
      </div>
      <label className='label'>
        {errMsg ? (
          <span className='label-text text-error'>{errMsg}</span>
        ) : (
          <span className='label-text'>文件大小不能超过 {size} MB</span>
        )}
      </label>
    </div>
  )
}

export const ImageUpload: FC<IUploadImageProps> = ({
  imgShape = 'rect',
  ...rest
}) => {
  return (
    <div>
      <Upload {...rest} type='image/*' />
      <div className='flex flex-wrap gap-1'>
        {rest.value
          .filter((url) => !!url)
          .map((url) => (
            <Thumbnail src={url} imgShape={imgShape} key={url} />
          ))}
      </div>
    </div>
  )
}

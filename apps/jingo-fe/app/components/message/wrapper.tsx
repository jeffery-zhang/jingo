'use client'

import { FC, useState, forwardRef, useImperativeHandle } from 'react'

export const MessageWrapper: FC = forwardRef((_, ref) => {
  const [list, setList] = useState([])

  useImperativeHandle(ref, () => ({}))

  return <div className=''></div>
})

MessageWrapper.displayName = 'MessageWrapper'

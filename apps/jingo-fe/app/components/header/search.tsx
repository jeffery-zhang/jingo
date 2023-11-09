'use client'

import { FC, useState } from 'react'
import { SearchIcon } from '@jingo/icons'
import { encryptPassword, decryptPassword } from '@jingo/utils/src/encrypt'

export const Search: FC = () => {
  const [value, setValue] = useState<string>('')
  const onSearch = () => {
    console.log('search: ', encryptPassword('123123'))
    console.log(
      'search: ',
      decryptPassword('U2FsdGVkX19NhJyCq93R9tt9+n5kIwlfch4/iymsyok='),
    )
  }

  return (
    <div className='dropdown md:dropdown-end'>
      <label tabIndex={0} className='flex'>
        <SearchIcon className='w-8 h-8 mr-4 cursor-pointer' />
      </label>
      <ul tabIndex={0} className='dropdown-content z-[1] mt-4'>
        <li className='bg-base-100 w-60 py-2 px-4 relative'>
          <input
            className='input input-sm input-bordered w-full pr-10'
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.code === 'Enter') {
                onSearch()
              }
            }}
          />
          <SearchIcon
            className='absolute w-6 h-6 right-6 top-1/2 -translate-y-1/2 cursor-pointer'
            onClick={onSearch}
          />
        </li>
      </ul>
    </div>
  )
}

import { FC } from 'react'

import { search } from '@/app/service/subjects'
import { getAll } from '@/app/service/categories'

export const Menu: FC = async () => {
  const { data } = await search({ pageSize: 5 })
  const { data: categories } = await getAll()

  return (
    <ul className='menu menu-horizontal'>
      {data.records.map((item, index) => (
        <li key={item._id} className='dropdown dropdown-hover'>
          <label tabIndex={index}>{item.name}</label>
          <ul
            tabIndex={index}
            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
          >
            {categories
              .filter((category) => category.parent._id === item._id)
              .map((category) => (
                <li key={category._id}>{category.name}</li>
              ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

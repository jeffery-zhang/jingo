import { FC } from 'react'

import { search } from '@/app/service/subjects'
import { getAll } from '@/app/service/categories'

interface IProps {
  className?: string
}

export const Menu: FC<IProps> = async ({ className }) => {
  const { data } = await search({ pageSize: 5 })
  const { data: categories } = await getAll()

  const renderSubList = (subjectId: string) => {
    const list = categories.filter(
      (category) => category.parent._id === subjectId,
    )

    if (list.length === 0) return null
    return (
      <ul className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
        {list.map((category) => (
          <li key={category._id}>
            <a>{category.name}</a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={`${className} menu menu-horizontal`}>
      {data.records.map((item) => (
        <li key={item._id} className='dropdown dropdown-hover dropdown-bottom'>
          <label>{item.name}</label>
          {renderSubList(item._id)}
        </li>
      ))}
    </ul>
  )
}

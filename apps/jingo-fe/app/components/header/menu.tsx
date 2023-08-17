import { FC } from 'react'

import { search } from '@/app/service/subjects'
import { getAll } from '@/app/service/categories'

interface IProps {
  className?: string
}

export const Menu: FC<IProps> = async ({ className }) => {
  const { data } = await search({ pageSize: 5 })
  const { data: categories } = await getAll()

  const renderSubList = (
    subjectId: string,
    index: number,
    media: 'md' | string = '',
  ) => {
    const list = categories.filter(
      (category) => category.parent._id === subjectId,
    )

    if (list.length === 0) return null
    return (
      <ul
        tabIndex={index + 1}
        className={`${
          media === 'md'
            ? 'dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
            : ''
        }`}
      >
        {list.map((category) => (
          <li key={category._id}>
            <a>{category.name}</a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className={className}>
      <ul className='menu hidden md:block'>
        {data.records.map((item, index) => (
          <li
            key={item._id}
            className='dropdown dropdown-hover dropdown-bottom'
          >
            <label tabIndex={index + 1}>{item.name}</label>
            {renderSubList(item._id, index, 'md')}
          </li>
        ))}
      </ul>
      <ul className='menu w-full md:hidden'>
        {data.records.map((item, index) => (
          <li key={item._id}>
            <details>
              <summary>{item.name}</summary>
              {renderSubList(item._id, index)}
            </details>
          </li>
        ))}
      </ul>
    </div>
  )
}

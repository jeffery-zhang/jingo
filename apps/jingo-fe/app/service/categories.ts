import { ISearchParams, TResponseSearchRecords } from '@jingo/utils'

import { fetcher } from './fetcher'
import { TResponse } from '../types/common'
import { ICategory, ISeachCategoriesParams } from '../types/categories'

const paths = {
  search: '/categories',
  getAll: '/categories/all',
  createOrUpdate: '/categories/save',
  delete: (id: string) => `/categories/delete/${id}`,
}

export const search = async (
  params: ISeachCategoriesParams,
): Promise<TResponse<TResponseSearchRecords<ICategory>>> =>
  fetcher.get(paths.search, {
    params,
  })

export const getAll = async (): Promise<TResponse<ICategory[]>> =>
  fetcher.get(paths.getAll)

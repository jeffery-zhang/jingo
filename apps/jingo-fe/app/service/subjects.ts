import { ISearchParams, TResponseSearchRecords } from '@jingo/utils'

import { fetcher } from './fetcher'
import { TResponse } from '../types/common'
import { ISubject } from '../types/subjects'

const paths = {
  search: '/subjects',
  getAll: '/subjects/all',
  createOrUpdate: '/subjects/save',
  delete: (id: string) => `/subjects/delete/${id}`,
}

export const search = async (
  params: ISearchParams,
): Promise<TResponse<TResponseSearchRecords<ISubject>>> =>
  fetcher.get(paths.search, {
    params,
  })

export const getAll = async (): Promise<TResponse<ISubject[]>> =>
  fetcher.get(paths.getAll)

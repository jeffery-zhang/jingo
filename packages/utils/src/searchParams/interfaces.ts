export interface ISearchParams {
  keywords?: string
  sortBy?: string
  order?: 'desc' | 'asc'
  page?: number
  pageSize?: number
  [key: string]: any
}

export type TResponseSearchRecords<T = any> = {
  page: number
  pageSize: number
  total: number
  totalPage: number
  records: T[]
}

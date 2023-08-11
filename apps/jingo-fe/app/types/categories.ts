import { ISearchParams } from '@jingo/utils'
import { ISubject } from './subjects'

export interface ICategory {
  _id: string
  name: string
  alias: string
  sort: number
  parent: Omit<ISubject, 'sort'>
}

export interface ISeachCategoriesParams extends ISearchParams {
  'parent._id'?: string
  'parent.name'?: string
}

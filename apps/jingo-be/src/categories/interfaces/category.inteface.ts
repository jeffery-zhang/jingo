import { ISearchParams } from '@jingo/utils'

export interface ICategoriesSearchParams extends ISearchParams {
  'parent._id': string
  'parent.name': string
}

import { ISearchParams } from '@jingo/utils'

export interface IPostsSearchParams extends ISearchParams {
  'author._id': string
  'subject._id': string
  'category._id': string
}

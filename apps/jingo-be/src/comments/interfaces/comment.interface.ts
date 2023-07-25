import { ISearchParams } from '@jingo/utils'

export interface ICommentsSearchParams extends ISearchParams {
  'author._id': string
  postId: string
}

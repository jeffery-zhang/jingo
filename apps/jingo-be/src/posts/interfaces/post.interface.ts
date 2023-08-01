import { ISearchParams } from '@jingo/utils'

export interface IPostsSearchParams extends ISearchParams {
  'author._id': string
  'subject._id': string
  'category._id': string
}

export interface IPostLikes {
  _id: string
  likes: string[]
}

export interface IPostPv {
  _id: string
  pv: number
}

import { ISearchParams } from '@jingo/utils'

import { ReplyType } from '../entities/reply-type.entity'

export interface IRepliesSearchParams extends ISearchParams {
  'author._id': string
  'replyTo._id': string
  'replyTo.type': ReplyType
}

export interface IReplyLikes {
  _id: string
  likes: string[]
}

import { fetcher } from './fetcher'
import { TResponse } from '../types/common'
import { IUpdateParams } from '../types/users'

const paths = {
  update: '/users/update',
}

export const update = async (data: IUpdateParams): Promise<TResponse> =>
  fetcher.put(paths.update, data)

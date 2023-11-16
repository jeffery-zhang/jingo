import { fetcher } from './fetcher'
import { TResponse } from '../types/common'

const paths = {
  batchUpload: '/obs/batchUpload',
}

export const batchUpload = async (
  data: FormData,
): Promise<TResponse<string[]>> => fetcher.put(paths.batchUpload, data)

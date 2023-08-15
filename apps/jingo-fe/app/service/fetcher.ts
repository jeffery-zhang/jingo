import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { cookies } from 'next/headers'

import { TResponse } from '../types/common'

const serverSideUrl = process.env.SERVER_URL
const clientSideUrl = process.env.CLIENT_URL

const fetcher = axios.create({
  baseURL: serverSideUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    config.baseURL = clientSideUrl
    const token = cookies().get('token')
    token &&
      config.headers &&
      (config.headers.Authorization = `Bearer ${token}`)
  } else {
    config.baseURL = serverSideUrl
  }

  return config
}

const responseInterceptor = (response: AxiosResponse<TResponse<any>>) => {
  if (response.status < 200 || response.status >= 300)
    return {
      success: false,
      status: response.status,
      message: '网络请求异常',
      data: [],
    }

  return response.data
}

fetcher.interceptors.request.use(requestInterceptor)
// @ts-ignore
fetcher.interceptors.response.use(responseInterceptor)

export { fetcher }

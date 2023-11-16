import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'

import { TResponse } from '../types/common'

const serverSideUrl = process.env.SERVER_URL
const clientSideUrl = process.env.NEXT_PUBLIC_CLIENT_URL

const fetcher = axios.create({
  baseURL: serverSideUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
  },
})

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    config.baseURL = clientSideUrl
    const token = window.localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } else {
    config.baseURL = serverSideUrl
  }

  return config
}

const responseInterceptor = (response: AxiosResponse<TResponse<any>>) => {
  const data = response.data

  if (!data.success) {
    message.error(data.message || '网络请求错误')
  }

  return data
}

fetcher.interceptors.request.use(requestInterceptor)
// @ts-ignore
fetcher.interceptors.response.use(responseInterceptor)

export { fetcher }

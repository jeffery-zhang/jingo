export type TResponse<T = any> = {
  success: boolean
  status: number
  message: string
  data: T
}

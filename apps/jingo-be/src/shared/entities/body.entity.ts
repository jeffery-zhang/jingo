import { HttpStatus } from '@nestjs/common'

export class ResponseBody {
  success: boolean
  message: string
  status: HttpStatus
  data: any

  constructor(
    success: boolean,
    message: string,
    status: HttpStatus,
    data: any,
  ) {
    this.success = success
    this.message = message
    this.status = status
    this.data = data
  }
}

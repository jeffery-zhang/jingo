import { ISearchParams, TResponseSearchRecords } from './interfaces'

interface IConditionsOption {
  keywords: string[]
  sortBy: string
}

interface IPager {
  page: number
  pageSize: number
  skipCount: number
}

export class MongoSearchConditions {
  pager: IPager

  constructor(params: ISearchParams, options: IConditionsOption) {
    this.pager = this.generatePager(params.page, params.pageSize)
  }

  generatePager(page = 1, pageSize = 10) {
    return {
      page,
      pageSize,
      skipCount: (page - 1) * pageSize,
    }
  }
}

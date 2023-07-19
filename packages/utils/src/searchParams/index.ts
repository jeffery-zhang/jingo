import { ISearchParams } from './interfaces'

export type * from './interfaces'

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
  public pager: IPager
  public sorter: { [key: string]: ISearchParams['order'] }
  public conditions: { [key: string]: any }

  constructor(params: ISearchParams, options: IConditionsOption) {
    this.pager = this.generatePager(params.page, params.pageSize)
    this.sorter = this.generateSorter(options.sortBy, params.order)
    this.conditions = this.generateConditions(params, options.keywords)
  }

  generatePager(page = 1, pageSize = 10) {
    return {
      page,
      pageSize,
      skipCount: (page - 1) * pageSize < 0 ? 0 : (page - 1) * pageSize,
    }
  }

  generateSorter(sortBy: string, order: ISearchParams['order']) {
    return {
      [sortBy]: order || 'asc',
    }
  }

  generateConditions(params: ISearchParams, keys: string[]) {
    const { page, pageSize, order, sortBy, keywords, ...rest } = params
    const conditions = {
      ...rest,
      $or: [],
    }
    keys.forEach((key) => {
      conditions['$or'].push({ [key]: { $regex: new RegExp(keywords, 'i') } })
    })
    return conditions
  }
}

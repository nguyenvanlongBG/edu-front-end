import request from '@components/core/utils/origin-request'
import type { PagingParam } from '../models/paging/paging-param'
export class BaseService {
  getController(): string {
    throw 'Chưa khai báo controller'
  }
  async getPaging(pagingParam: PagingParam) {
    const controller = this.getController()
    if (!controller) {
      throw 'Controller không được định nghĩa'
    }
    return await request({
      url: `${controller}/paging`,
      method: 'POST',
      data: pagingParam,
    })
  }
}

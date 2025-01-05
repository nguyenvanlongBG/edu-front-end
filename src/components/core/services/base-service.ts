import request from '@components/core/utils/origin-request'
import type { PagingParam } from '../models/paging/paging-param'
import type { FilterCondition } from '../models/paging/filter-condition'
export class BaseService {
  getController(): string {
    throw 'Chưa khai báo controller'
  }
  async getPaging(pagingParam: PagingParam) {
    const controller = this.getController()
    return await request({
      url: `${controller}/paging`,
      method: 'POST',
      data: pagingParam,
    })
  }
  async filter(filters: FilterCondition[]) {
    return await this.post(filters, 'filter')
  }
  async getById(id: string) {
    const controller = this.getController()
    return await request({
      url: `${controller + ('/' + id)}`,
      method: 'GET',
    })
  }
  async get(url: string = '') {
    const controller = this.getController()
    return await request({
      url: `${controller + (url ? '/' + url : '')}`,
      method: 'GET',
    })
  }
  async post(data: unknown, url: string = '') {
    const controller = this.getController()
    return await request({
      url: `${controller + (url ? '/' + url : '')}`,
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  async put(data: unknown, url: string = '') {
    const controller = this.getController()
    return await request({
      url: `${controller + (url ? '/' + url : '')}`,
      method: 'PUT',
      data: data,
    })
  }
  async delete(data: unknown, url: string = '') {
    const controller = this.getController()
    return await request({
      url: `${controller + (url ? '/' + url : '')}`,
      method: 'DELETE',
      data: data,
    })
  }
}

import request from '@components/core/utils/origin-request'
import type { PagingParam } from '../models/paging/paging-param'
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
  async get(url: string = '') {
    const controller = this.getController()
    return await request({
      url: `${controller + (url ? url + '/' : '')}`,
      method: 'GET',
    })
  }
  async post(data: unknown, url: string = '') {
    const controller = this.getController()
    return await request({
      url: `${controller + (url ? url + '/' : '')}`,
      method: 'POST',
      data: data,
    })
  }
  async put(data: unknown, url: string = '') {
    const controller = this.getController()
    return await request({
      url: `${controller + (url ? url + '/' : '')}`,
      method: 'PUT',
      data: data,
    })
  }
  async delete(data: unknown, url: string = '') {
    const controller = this.getController()
    return await request({
      url: `${controller + (url ? url + '/' : '')}`,
      method: 'DELETE',
      data: data,
    })
  }
}

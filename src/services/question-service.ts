import type { PagingParam } from '@/components/core/models/paging/paging-param'
import { BaseService } from '@/components/core/services/base-service'
export default class QuestionService extends BaseService {
  getController(): string {
    return 'Question'
  }
  async insertQuestionLibrary(data: unknown) {
    return await this.post(data, 'library')
  }
  async getPagingQuestionLibrary(data: PagingParam) {
    const payload = {
      page: data.page,
      filters: data.filters,
      take: data.take,
      skip: data.skip,
    }
    return await this.post(payload, 'library/paging')
  }
}

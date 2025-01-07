import { BaseService } from '@/components/core/services/base-service'
export default class QuestionService extends BaseService {
  getController(): string {
    return 'Question'
  }
  async insertQuestionLibrary(data: unknown) {
    return await this.post(data, 'library')
  }
}

import { BaseService } from '@/components/core/services/base-service'
export default class QuestionService extends BaseService {
  getController(): string {
    return 'Question'
  }
}

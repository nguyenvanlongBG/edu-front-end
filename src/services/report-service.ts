import { BaseService } from '@/components/core/services/base-service'
export default class ExamService extends BaseService {
  getController(): string {
    return 'Report'
  }
  async reportTest() {
    return await this.get('test')
  }
}

import { BaseService } from '@/components/core/services/base-service'
import request from '@components/core/utils/origin-request'
export default class TestService extends BaseService {
  getController(): string {
    return 'Test'
  }
  async getQuestionOfTest(testId: string) {
    return await request({
      url: `Test/${testId}/do`,
      method: 'GET',
    })
  }
}

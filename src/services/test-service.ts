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
  async autoGenQuestion(param: Record<string, unknown>) {
    return await this.post(param, 'auto-gen')
  }
  async getInfoDoTest(testId: string) {
    return await request({
      url: `Test/${testId}/do`,
      method: 'GET',
    })
  }
  async getQuestionOfTestEdit(testId: string) {
    return await request({
      url: `Test/${testId}/edit`,
      method: 'GET',
    })
  }
  async examsUserHistory(testId: string) {
    return await this.get(testId + '/history')
  }
}

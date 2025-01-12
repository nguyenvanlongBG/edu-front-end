import { BaseService } from '@/components/core/services/base-service'
export default class ExamService extends BaseService {
  getController(): string {
    return 'Report'
  }
  async reportTest(data: Record<string, unknown>) {
    return await this.post(data, 'test')
  }
  async reportChapter(data: Record<string, unknown>) {
    return await this.post(data, 'chapter')
  }
  async reportLevel(data: Record<string, unknown>) {
    return await this.post(data, 'level')
  }
}

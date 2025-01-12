import { BaseService } from '@/components/core/services/base-service'
import type { ExamDto } from '@/models/exam/Dto/exam-dto'
export default class ExamService extends BaseService {
  getController(): string {
    return 'Exam'
  }
  async doNewExam(testId: string) {
    return await this.post(testId, 'new-exam')
  }
  async doExam(exam: ExamDto) {
    return await this.put(exam, 'do')
  }
  async submitExam(exam: ExamDto) {
    return await this.put(exam, 'submit')
  }
  async getTestOfExam(examId: string) {
    return await this.post(examId, 'test-of-exam')
  }
  async historyExam(examId: string) {
    return await this.get(examId + '/history')
  }
}

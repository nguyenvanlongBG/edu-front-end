import { BaseService } from '@/components/core/services/base-service'
export default class EnrollmentClassService extends BaseService {
  getController(): string {
    return 'Enrollment'
  }
  async enrollsOfClass(classroom_id: string) {
    return await this.get(classroom_id + '/enroll')
  }
}

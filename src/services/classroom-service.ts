import { BaseService } from '@/components/core/services/base-service'

export default class ClassroomService extends BaseService {
  getController(): string {
    return 'Classroom'
  }
  async getAllClassOfUser() {
    return await this.get('class-of-user')
  }
}

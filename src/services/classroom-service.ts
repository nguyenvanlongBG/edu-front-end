import { BaseService } from '@/components/core/services/base-service'

export default class ClassroomService extends BaseService {
  getController(): string {
    return 'Classroom'
  }
  async pagingClassroom(data: Record<string, unknown>) {
    return await this.post(data, 'paging-classroom')
  }
  async getAllClassOfUser() {
    return await this.get('class-of-user')
  }
}

import { BaseService } from '@/components/core/services/base-service'
export default class ChapterService extends BaseService {
  getController(): string {
    return 'Chapter'
  }
}

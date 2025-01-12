import { BaseService } from '@/components/core/services/base-service'
export default class PostService extends BaseService {
  getController(): string {
    return 'Post'
  }
}

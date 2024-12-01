import { BaseService } from '@/components/core/services/base-service'
import request from '@components/core/utils/origin-request'
export default class FileQuestionService extends BaseService {
  async uploadFileQuestion(formData: FormData) {
    return await request({
      url: 'Test/uploadFile',
      method: 'POST',
      data: formData,
    })
  }
}

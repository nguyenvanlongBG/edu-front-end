import request from '@components/core/utils/origin-request'
export default async function uploadFileQuestion(formData: FormData) {
  return await request({
    url: 'Test/uploadFile',
    method: 'POST',
    data: formData,
  })
}

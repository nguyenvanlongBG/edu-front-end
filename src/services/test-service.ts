import request from '@components/core/utils/origin-request'
export default async function getQuestionOfTest(testId: string) {
  return await request({
    url: `Test/${testId}/do`,
    method: 'GET',
  })
}

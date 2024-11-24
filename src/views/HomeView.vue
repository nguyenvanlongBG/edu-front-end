<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import EQuestion from '@/components/question/EQuestion.vue'
import type { Question } from '@/models/question/question'
import uploadFileQuestion from '@/services/file-question-service'
import getQuestionOfTest from '@/services/test-service'

import { ref } from 'vue'
export default {
  components: {
    EQuestion,
  },
  setup() {
    const fileInput = ref<File | null>(null)
    const questions = ref<Question[]>([])
    function validateInput() {
      return {
        isValid: false,
        message: 'Không hợp lệ',
      }
    }
    const handleFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files.length > 0) {
        fileInput.value = input.files[0] // Lưu tệp vào biến `fileInput`
      }
    }
    async function testUploadFile() {
      if (!fileInput.value) {
        return
      }
      const formData = new FormData()
      formData.append('file', fileInput.value) // Thêm tệp vào FormData
      formData.append('testId', '12') // Thêm các trường khác nếu cần
      const result = await uploadFileQuestion(formData)
      questions.value = result as unknown as Question[]
    }
    async function getQuestion() {
      const testId = commonFunction.generateID()
      const result = await getQuestionOfTest(testId)
      questions.value = result as unknown as Question[]
    }
    return {
      fileInput,
      validateInput,
      testUploadFile,
      handleFileChange,
      questions,
      getQuestion,
    }
  },
}
</script>

<template>
  <form @submit.prevent="getQuestion">
    <div>
      <label for="fileInput">Chọn tệp:</label>
      <input type="file" @change="handleFileChange" />
    </div>
    <div>
      <label for="testId">Test ID:</label>
    </div>
    <button type="submit">Gửi</button>
  </form>
  <div class="list-question">
    <div v-for="question in questions" :key="question.question_id">
      <EQuestion
        :question="question"
        :isShowResult="true"
        :isShowAnswer="true"
      />
    </div>
  </div>
</template>
<style lang="scss">
.list-question {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
</style>

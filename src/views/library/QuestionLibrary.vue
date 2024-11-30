<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import EQuestion from '@/components/question/EQuestion.vue'
import ETableLabel from '@/components/core/components/table-label/ETableLabel.vue'
import EPaging from '@/components/core/components/paging/EPaging.vue'
import type { Question } from '@/models/question/question'
import uploadFileQuestion from '@/services/file-question-service'
import getQuestionOfTest from '@/services/test-service'

import { ref } from 'vue'
import { TableLabelControl } from '@/components/core/models/table-label/table-label-control'
import { ItemTableLabel } from '@/components/core/models/table-label/item-table-label'
import { PagingControl } from '@/components/core/models/paging/paging-control'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { useI18n } from 'vue-i18n'
import EButton from '@/components/core/components/button/EButton.vue'
export default {
  components: {
    EQuestion,
    EButton,
    ETableLabel,
    EPaging,
  },
  setup() {
    const { t } = useI18n()
    const fileInput = ref<File | null>(null)
    const tableLabel = ref<TableLabelControl>(new TableLabelControl())
    tableLabel.value.displayValue = 'index'
    const questions = ref<Question[]>([])
    const pagingControl = ref(new PagingControl())
    const addQuestionBtn = new ButtonControl({
      label: t('i18nQuestion.AddQuestion'),
      classType: 'outline',
    })
    // Object lưu trữ các refs động
    const questionRefs = ref<{ [key: string]: HTMLElement | null }>({})

    // Hàm để gán ref động theo index
    const setQuestionRef = (index: string) => (el: HTMLElement | null) => {
      if (el) {
        questionRefs.value[index] = el
      }
    }
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
      tableLabel.value.data = questions.value.map((question, index) => {
        return new ItemTableLabel({
          value: question.question_id,
          data: { ...question, index: index + 1 },
        })
      })
    }
    function onSelectQuestionLabel(
      itemTableLabel: ItemTableLabel,
      index: number,
    ) {
      const target = questionRefs.value[itemTableLabel.value]
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        console.error(`Không tìm thấy phần tử với index ${index}`)
      }
    }
    function onAddQuestion() {}
    return {
      tableLabel,
      addQuestionBtn,
      pagingControl,
      fileInput,
      validateInput,
      testUploadFile,
      handleFileChange,
      setQuestionRef,
      questions,
      getQuestion,
      questionRefs,
      onSelectQuestionLabel,
      onAddQuestion,
    }
  },
}
</script>

<template src="./question-library.html"></template>
<style src="./question-library.scss" lang="scss"></style>

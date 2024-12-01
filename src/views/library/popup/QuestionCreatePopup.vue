<template src="./question-create-popup.html"></template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import EButton from '@core/components/button/EButton.vue'
// import { DialogControl } from '@core/models/dialog/dialog-control'
import EPopup from '@core/components/popup/EPopup.vue'
import { ButtonControl } from '@core/models/button/button-control'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { useI18n } from 'vue-i18n'
import type { Question } from '@/models/question/question'
import uploadFileQuestion from '@/services/file-question-service'
import EQuestion from '@/components/question/EQuestion.vue'

export default defineComponent({
  components: {
    EPopup,
    EButton,
    EQuestion,
  },
  props: {
    control: {
      type: PopupControl,
      required: true,
    },
  },
  emits: ['change'],
  setup() {
    const { t } = useI18n()
    const questions = ref<Question[]>([])
    const cancelBtn = new ButtonControl({
      label: t('i18nButton.cancel'),
    })
    const saveBtn = new ButtonControl({
      label: t('i18nButton.save'),
      classType: 'solid',
    })
    const createQuestionBtn = new ButtonControl({
      label: t('i18nQuestion.CreateQuestion'),
      classType: 'outline',
    })
    const importQuestionBtn = new ButtonControl({
      label: t('i18nQuestion.ImportQuestion'),
      classType: 'solid',
    })
    const fileInputRef = ref<HTMLElement | null>(null)
    function onBtnClick(btn: ButtonControl) {
      if (btn) {
      }
    }
    function onImportQuestion() {
      // Kích hoạt input file ẩn
      if (fileInputRef.value) {
        fileInputRef.value.click()
      }
    }
    async function handleFileChange(event: Event) {
      try {
        const input = event.target as HTMLInputElement
        if (input && input.files && input.files.length) {
          const file = input.files[0]
          const formData = new FormData()
          formData.append('file', file) // Thêm tệp vào FormData
          formData.append('testId', '12') // Thêm các trường khác nếu cần
          const result = await uploadFileQuestion(formData)
          questions.value = result as unknown as Question[]
        }
      } catch (error: unknown) {
        console.log(error)
      }
    }

    return {
      questions,
      cancelBtn,
      saveBtn,
      onBtnClick,
      createQuestionBtn,
      importQuestionBtn,
      fileInputRef,
      onImportQuestion,
      handleFileChange,
    }
  },
})
</script>

<style src="./question-create-popup.scss" scoped></style>

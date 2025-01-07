<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import PopupLibrary from '@core/library/popup-library'
import EQuestion from '@/components/question/EQuestion.vue'
import ETableLabel from '@/components/core/components/table-label/ETableLabel.vue'
import EPaging from '@/components/core/components/paging/EPaging.vue'
import { Question } from '@/models/question/question'
import TestService from '@/services/test-service'
import QuestionService from '@/services/question-service'
import { ref } from 'vue'
import { ItemTableLabel } from '@/components/core/models/table-label/item-table-label'
import { PagingControl } from '@/components/core/models/paging/paging-control'
import { PagingParam } from '@/components/core/models/paging/paging-param'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { useI18n } from 'vue-i18n'
import EButton from '@/components/core/components/button/EButton.vue'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import QuestionCreatePopup from '@views/library/popup/QuestionCreatePopup.vue'
import FileQuestionService from '@/services/file-question-service'
import { QuestionControl } from '@/models/question/question-control'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import { LoadingType } from '@/components/core/enums/Common'
import ELoading from '@/components/core/components/loading/ELoading.vue'
import { nextTick } from 'vue'
import { ModelState } from '@/components/core/enums/model-state'
export default {
  components: {
    EQuestion,
    EButton,
    ETableLabel,
    EPaging,
    QuestionCreatePopup,
    ELoading,
  },
  setup() {
    const { t } = useI18n()
    const fileInput = ref<File | null>(null)
    const isLoading = ref(false)
    const loadingControl = ref(
      new LoadingControl({
        type: LoadingType.LoadingNormal,
      }),
    )
    const questions = ref<Question[]>([])
    const pagingControl = ref(new PagingControl())
    const dicQuestionControl = ref<Record<string, QuestionControl>>({})
    const addQuestionBtn = new ButtonControl({
      label: t('i18nQuestion.AddQuestion'),
      classType: 'outline',
    })
    // Object lưu trữ các refs động
    const questionRefs = ref<{ [key: string]: HTMLElement | null }>({})

    // Hàm để gán ref động theo index
    // const setQuestionRef = (index: string) => (el: HTMLElement | null) => {
    //   if (el) {
    //     questionRefs.value[index] = el
    //   }
    // }
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
    async function handleLoadData(pagingParam: PagingParam) {
      isLoading.value = true
      const questionService = new QuestionService()
      const result = await questionService.getPaging(pagingParam)
      questions.value = commonFunction.convertToInstances<Question>(
        result as unknown as Record<string, unknown>[],
        Question,
      )
      isLoading.value = false
    }
    async function testUploadFile() {
      if (!fileInput.value) {
        return
      }
      const formData = new FormData()
      formData.append('file', fileInput.value) // Thêm tệp vào FormData
      formData.append('testId', '12') // Thêm các trường khác nếu cần
      const fileQuestionService = new FileQuestionService()
      const result = await fileQuestionService.uploadFileQuestion(formData)
      questions.value = result as unknown as Question[]
    }
    async function getQuestion() {
      const testService = new TestService()
      const testId = commonFunction.generateID()
      const result = await testService.getQuestionOfTest(testId)
      questions.value = result as unknown as Question[]
    }
    function onSelectQuestionLabel(
      itemTableLabel: ItemTableLabel,
      index: number,
    ) {
      scrollToQuestion(itemTableLabel.value)
    }
    function scrollToQuestion(questionId: string) {
      const target = questionRefs.value[questionId]
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        console.error(`Không tìm thấy phần tử với index ${questionId}`)
      }
    }
    function getQuestionControl(question: Question) {
      if (!question || !question.question_id) return
      if (!(question.question_id in dicQuestionControl.value)) {
        dicQuestionControl.value[question.question_id] = new QuestionControl({
          value: question,
          isShowActionToolbar: true,
          isShowLevel: true,
          readonly: true,
        })
      }
      return dicQuestionControl.value[question.question_id]
    }
    async function handleAddQuestion(items: Question[]) {
      if (!items || !items.length) return
      items.forEach(item => {
        item.content = commonFunction.convertToString(item.object_content)
        item.options?.forEach(
          o => (o.content = commonFunction.convertToString(o.object_content)),
        )
        item.results?.forEach(
          o => (o.content = commonFunction.convertToString(o.object_content)),
        )
      })
      const questionService = new QuestionService()
      await questionService.insertQuestionLibrary(items)
    }
    async function onAddQuestion() {
      const popupAddQuestion = import(
        '@views/library/popup/QuestionCreatePopup.vue'
      )
      const popupControl = new PopupControl({
        width: '600px',
      })
      const methodHandle = async (event: string, data: unknown) => {
        if (event == 'close') {
          popupControl.close()
        } else if (event == 'ok') {
          const questions = data as Question[]
          if (questions?.length) {
            await handleAddQuestion(questions)
            popupControl.close()
            const param = new PagingParam()
            await handleLoadData(param)
            const lastQuestion = questions[questions.length - 1]
            if (lastQuestion) {
              nextTick(() => {
                scrollToQuestion(lastQuestion.question_id)
              })
            }
          }
        }
      }
      popupControl.show(
        popupAddQuestion,
        {
          control: popupControl,
        },
        methodHandle,
      )
    }
    return {
      isLoading,
      loadingControl,
      handleLoadData,
      dicQuestionControl,
      addQuestionBtn,
      pagingControl,
      fileInput,
      validateInput,
      testUploadFile,
      handleFileChange,
      getQuestionControl,
      questions,
      getQuestion,
      questionRefs,
      onSelectQuestionLabel,
      onAddQuestion,
      scrollToQuestion,
    }
  },
  async created() {},
  async mounted() {
    const param = new PagingParam()
    await this.handleLoadData(param)
  },
}
</script>

<template src="./question-library.html"></template>
<style src="./question-library.scss" lang="scss"></style>

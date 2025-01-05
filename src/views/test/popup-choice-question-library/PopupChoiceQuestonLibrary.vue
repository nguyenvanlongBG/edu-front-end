<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import EButton from '@/components/core/components/button/EButton.vue'
import EPaging from '@/components/core/components/paging/EPaging.vue'
import EPopup from '@/components/core/components/popup/EPopup.vue'
import { LoadingType } from '@/components/core/enums/Common'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import { PagingControl } from '@/components/core/models/paging/paging-control'
import { PagingParam } from '@/components/core/models/paging/paging-param'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import EQuestion from '@/components/question/EQuestion.vue'
import { Question } from '@/models/question/question'
import { QuestionControl } from '@/models/question/question-control'
import QuestionService from '@/services/question-service'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  components: {
    EQuestion,
    EButton,
    EPopup,
    EPaging,
  },
  props: {
    control: {
      type: PopupControl,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const isLoading = ref(false)
    const loadingControl = ref(
      new LoadingControl({
        type: LoadingType.LoadingNormal,
      }),
    )
    const cancelBtn = new ButtonControl({
      label: t('i18nButton.cancel'),
    })
    const saveBtn = new ButtonControl({
      label: t('i18nButton.agree'),
      classType: 'solid',
    })
    const pagingControl = ref(new PagingControl())
    // Object lưu trữ các refs động
    const questionRefs = ref<{ [key: string]: HTMLElement | null }>({})

    // Hàm để gán ref động theo index
    const setQuestionRef = (index: string) => (el: HTMLElement | null) => {
      if (el) {
        questionRefs.value[index] = el
      }
    }
    const dicQuestionControl = ref<Record<string, QuestionControl>>({})
    const questions = ref<Question[]>([])
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
    function changeLoading(loadingStatus: boolean = false) {
      isLoading.value = loadingStatus
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
    function onSave() {
      const control = props.control
      if (control && typeof control.handleEmit == 'function') {
        control.handleEmit('ok', questions.value)
      }
    }
    return {
      isLoading,
      loadingControl,
      dicQuestionControl,
      getQuestionControl,
      questions,
      cancelBtn,
      saveBtn,
      pagingControl,
      questionRefs,
      setQuestionRef,
      changeLoading,
      handleLoadData,
      onSave,
    }
  },
  async mounted() {
    const param = new PagingParam()
    this.handleLoadData(param)
  },
}
</script>
<template src="./popup-choice-question-library.html"></template>
<style src="./popup-choice-question-library.scss" lang="scss" />

<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import editorFunction from '@/components/core/commons/editorFunction'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import EButton from '@/components/core/components/button/EButton.vue'
import ELoading from '@/components/core/components/loading/ELoading.vue'
import EPopup from '@/components/core/components/popup/EPopup.vue'
import { LoadingType } from '@/components/core/enums/Common'
import { ModelState } from '@/components/core/enums/model-state'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import EQuestion from '@/components/question/EQuestion.vue'
import { GuidEmpty } from '@/constants/consstant'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { QuestionType } from '@/enums/question'
import { Role } from '@/enums/role'
import { OptionQuestion } from '@/models/option-question/option-question'
import { Question } from '@/models/question/question'
import { QuestionControl } from '@/models/question/question-control'
import type { User } from '@/models/user/user'
import FileQuestionService from '@/services/file-question-service'
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  components: {
    EQuestion,
    EButton,
    EPopup,
    ELoading,
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
    const addQuestionBtn = ref(
      new ButtonControl({
        label: t('i18nQuestion.CreateQuestion'),
      }),
    )
    const choiceLibraryBtn = ref(
      new ButtonControl({
        label: t('i18nQuestion.ChoiceLibraryQuestion'),
      }),
    )
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
    const fileInputRef = ref<HTMLElement | null>(null)
    function getQuestionControl(question: Question) {
      if (!question || !question.question_id) return
      if (!(question.question_id in dicQuestionControl.value)) {
        dicQuestionControl.value[question.question_id] = new QuestionControl({
          value: question,
          isShowActionToolbar: false,
          isShowLevel: false,
          readonly: true,
        })
      }
      return dicQuestionControl.value[question.question_id]
    }
    function onAddQuestion() {
      const newQuestion = new Question()
      newQuestion.State = ModelState.INSERT
      newQuestion.question_id = commonFunction.generateID()
      newQuestion.options = [
        new OptionQuestion({
          State: ModelState.INSERT,
          question_id: newQuestion.question_id,
          option_question_id: commonFunction.generateID(),
          object_content: [],
        }),
      ]
      handleAddQuestion([newQuestion])
      nextTick(() => {
        scrollToQuestion(newQuestion.question_id)
      })
    }
    function onChoiceQuestionLibrary() {
      const popupControl = new PopupControl({
        width: '1200px',
      })
      const component = import(
        '@views/test/popup-choice-question-library/PopupChoiceQuestonLibrary.vue'
      )
      const methodHandle = (event: string, data: unknown) => {
        if (event == 'close') {
          popupControl.close()
        } else if (event == 'ok') {
          const questions = data as Question[]
          if (questions?.length) {
            handleAddQuestion(questions)
            popupControl.close()
          }
        }
      }
      popupControl.show(
        component,
        {
          control: popupControl,
        },
        methodHandle,
      )
    }
    function scrollToQuestion(questionId: string) {
      const target = questionRefs.value[questionId]
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        console.error(`Không tìm thấy phần tử với index ${questionId}`)
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
        changeLoading(true)
        const input = event.target as HTMLInputElement
        if (input && input.files && input.files.length) {
          const file = input.files[0]
          const formData = new FormData()
          formData.append('file', file) // Thêm tệp vào FormData
          formData.append('testId', '12') // Thêm các trường khác nếu cần
          const fileQuestionService = new FileQuestionService()
          const result = await fileQuestionService.uploadFileQuestion(formData)
          const newQuestions = commonFunction.convertToInstances<Question>(
            result as unknown as Array<Record<string, unknown>>,
            Question,
          )
          if (!newQuestions || !newQuestions.length) return
          newQuestions.forEach(question => (question.State = ModelState.INSERT))
          handleAddQuestion(newQuestions)
        }
      } catch (error: unknown) {
        console.log(error)
      } finally {
        changeLoading(false)
      }
    }
    function handleAddQuestion(items: Question[]) {
      if (!items || !items.length) return
      items.forEach(question => {
        question.State = ModelState.INSERT
        question.options?.forEach(option => (option.State = ModelState.INSERT))
        question.results?.forEach(result => (result.State = ModelState.INSERT))
        if (!(question.question_id in dicQuestionControl.value)) {
          dicQuestionControl.value[question.question_id] = new QuestionControl({
            value: question,
            isShowActionToolbar: true,
            isShowLevel: true,
            isShowToolEditor: true,
            readonly: false,
          })
        }
      })
      questions.value = questions.value.concat(items)
    }
    function changeLoading(loadingStatus: boolean = false) {
      isLoading.value = loadingStatus
    }
    function onClose() {
      const control = props.control
      if (control && typeof control.close == 'function') {
        control.close()
      }
    }
    function onSave() {
      const control = props.control
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (user && control && typeof control.handleEmit == 'function') {
        const questionsTmp = commonFunction.convertToData<Question[]>(
          commonFunction.convertToString(questions.value),
        )
        questionsTmp.forEach(item => {
          item.content = editorFunction.getContent(item.object_content)
          item.user_id = user.role_id == Role.Admin ? GuidEmpty : user.user_id
          item.subject_id = GuidEmpty
          item.options?.forEach(o => {
            o.State = ModelState.INSERT
            o.content = editorFunction.getContent(o.object_content)
          })
          item.results?.forEach(o => {
            o.State = ModelState.INSERT
            if (item.type == QuestionType.FillResult) {
              o.content = editorFunction.getContent(o.object_content)
            }
          })
        })
        control.handleEmit('ok', questionsTmp)
      }
    }
    return {
      isLoading,
      loadingControl,
      dicQuestionControl,
      getQuestionControl,
      fileInputRef,
      onImportQuestion,
      handleFileChange,
      scrollToQuestion,
      questions,
      handleAddQuestion,
      cancelBtn,
      saveBtn,
      addQuestionBtn,
      choiceLibraryBtn,
      onAddQuestion,
      onChoiceQuestionLibrary,
      questionRefs,
      setQuestionRef,
      changeLoading,
      onClose,
      onSave,
    }
  },
}
</script>
<template src="./question-create-popup.html"></template>
<style src="./question-create-popup.scss" lang="scss" />

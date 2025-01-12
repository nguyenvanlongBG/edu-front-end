<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
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
import { FilterOperator, LoadingType } from '@/components/core/enums/Common'
import ELoading from '@/components/core/components/loading/ELoading.vue'
import { nextTick } from 'vue'
import editorFunction from '@/components/core/commons/editorFunction'
import { FilterCondition } from '@/components/core/models/paging/filter-condition'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import type { User } from '@/models/user/user'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { Role } from '@/enums/role'
import { ResultQuestion } from '@/models/result-question/result-question'
import { ModelState } from '@/components/core/enums/model-state'
import { QuestionType } from '@/enums/question'
import { MultiComboboxControl } from '@/components/core/models/multi-combobox/multi-combobox-control'
import ChapterService from '@/services/chapter-service'
import EMultiCombobox from '@/components/core/components/e-multi-combobox/EMultiCombobox.vue'
import questionHelper from '@/helper/question/question-helper'
export default {
  components: {
    EQuestion,
    EButton,
    ETableLabel,
    EPaging,
    QuestionCreatePopup,
    EMultiCombobox,
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
    const chapterControl = ref(
      new MultiComboboxControl({
        displayField: 'name',
        valueField: 'chapter_id',
        data: [],
      }),
    )
    const dicQuestionControl = ref<Record<string, QuestionControl>>({})
    const addQuestionBtn = new ButtonControl({
      label: t('i18nQuestion.AddQuestion'),
      classType: 'outline',
    })
    // Object lưu trữ các refs động
    const questionRefs = ref<{ [key: string]: HTMLElement | null }>({})

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
      await handleLoadQuestion(pagingParam)
      const chapterService = new ChapterService()
      const resultChapter = await chapterService.filter([])
      chapterControl.value.data = (resultChapter ?? []) as unknown as Array<
        Record<string, unknown>
      >
    }
    async function handleLoadQuestion(pagingParam: PagingParam) {
      isLoading.value = true
      const questionService = new QuestionService()
      const result = await questionService.getPagingQuestionLibrary(pagingParam)
      questions.value = commonFunction.convertToInstances<Question>(
        result as unknown as Record<string, unknown>[],
        Question,
      )
      questionHelper.mapQuestionsToUI(questions.value)
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
      const btnActionsAllQuestion = [
        new ButtonControl({
          label: 'Lưu',
          name: 'save',
          classType: 'solid',
          readonly: true,
        }),
        new ButtonControl({
          label: t('i18nQuestion.Edit'),
          name: 'edit',
          classType: 'outline',
        }),
      ]
      if (!(question.question_id in dicQuestionControl.value)) {
        dicQuestionControl.value[question.question_id] = new QuestionControl({
          value: question,
          isShowActionToolbar: true,
          isShowLevel: false,
          readonly: true,
          btnActions: btnActionsAllQuestion,
          customAction: handleActionQuestion,
        })
      }
      return dicQuestionControl.value[question.question_id]
    }
    async function handleActionQuestion(eventName: string, question: Question) {
      if (eventName && question) {
        const questionControl = dicQuestionControl.value[question.question_id]
        const btnSave = questionControl.btnActions?.find(
          btn => btn.name == 'save',
        )
        const btnEdit = questionControl.btnActions?.find(
          btn => btn.name == 'edit',
        )
        if (questionControl) {
          if (eventName == 'edit') {
            questionControl.readonly = false
            questionControl.isShowQuestionType = true
            questionControl.isShowLevel = true
            questionControl.isShowChapter = true
            questionControl.isShowToolEditor = true
            questionControl.isReadonlyToolEditor = false
            if (btnSave) {
              btnSave.readonly = false
            }
            if (btnEdit) {
              btnEdit.readonly = true
            }
          } else if (eventName == 'save') {
            const questionService = new QuestionService()
            const questionsTmp = commonFunction.convertToData<Question>(
              commonFunction.convertToString(questionControl.value),
            )
            questionsTmp.chapter_ids =
              questionControl.value.lstChapterId?.join(',') ?? ''
            questionsTmp.content = editorFunction.getContent(
              questionsTmp.object_content,
            )
            questionsTmp.options?.forEach(o => {
              o.content = editorFunction.getContent(o.object_content)
            })
            questionsTmp.results?.forEach(o => {
              if (questionsTmp.type == QuestionType.FillResult) {
                o.content = editorFunction.getContent(o.object_content)
              }
            })
            await questionService.put(questionsTmp)
            questionControl.readonly = true
            questionControl.isShowQuestionType = false
            questionControl.isShowLevel = false
            questionControl.isShowToolEditor = false
            questionControl.isReadonlyToolEditor = true
            if (btnSave) {
              btnSave.readonly = true
            }
            if (btnEdit) {
              btnEdit.readonly = false
            }
          }
        }
      }
    }
    async function handleAddQuestion(items: Question[]) {
      if (!items || !items.length) return
      const questionService = new QuestionService()
      await questionService.insertQuestionLibrary(items)
    }
    function buildFilterQuestion() {
      let filters = [] as FilterCondition[]
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (user) {
        if (user.role_id == Role.Teacher) {
          filters = [
            new FilterCondition({
              Field: 'user_id',
              Operator: FilterOperator.Equal,
              Value: user.user_id,
            }),
          ]
        }
      }
      return filters
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
            param.filters = buildFilterQuestion()
            await handleLoadQuestion(param)
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
    function onChangeAnswer(question: Question, answer: string) {
      if (!question.results || !question.results?.length) {
        question.results = [] as ResultQuestion[]
        const result = new ResultQuestion({
          result_question_id: commonFunction.generateID(),
          question_id: question.question_id,
          State: ModelState.INSERT,
        })
        question.results.push(result)
      }
      switch (question.type) {
        case QuestionType.SingleChoice:
          const resultTmpSi = question.results[0]
          resultTmpSi.content = answer as string
          resultTmpSi.State =
            resultTmpSi.State == ModelState.INSERT
              ? resultTmpSi.State
              : ModelState.EDIT
          break
        case QuestionType.MultiChoice:
          const resultTmpMu = question.results[0]
          resultTmpMu.content = answer as string
          resultTmpMu.State =
            resultTmpMu.State == ModelState.INSERT
              ? resultTmpMu.State
              : ModelState.EDIT
        case QuestionType.FillResult:
          const resultFill = question.results[0]
          const objectContent = commonFunction.convertToData<object>(answer)
          resultFill.content =
            'ops' in objectContent
              ? commonFunction.convertToString(objectContent.ops)
              : '[]'
          resultFill.State =
            resultFill.State == ModelState.INSERT
              ? resultFill.State
              : ModelState.EDIT
          break
      }
    }
    return {
      isLoading,
      onChangeAnswer,
      loadingControl,
      chapterControl,
      handleLoadData,
      handleLoadQuestion,
      buildFilterQuestion,
      handleActionQuestion,
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
    param.filters = this.buildFilterQuestion()
    this.handleLoadData(param)
  },
}
</script>

<template src="./question-library.html"></template>
<style src="./question-library.scss" lang="scss"></style>

<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import EQuestion from '@/components/question/EQuestion.vue'
import ETableLabel from '@/components/core/components/table-label/ETableLabel.vue'
import { Question } from '@/models/question/question'
import TestService from '@/services/test-service'
import FileQuestionService from '@/services/file-question-service'

import { nextTick, ref } from 'vue'
import { TableLabelControl } from '@/components/core/models/table-label/table-label-control'
import { ItemTableLabel } from '@/components/core/models/table-label/item-table-label'
import EButton from '@/components/core/components/button/EButton.vue'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { useI18n } from 'vue-i18n'
import { TestDto } from '@/models/test/test-dto'
import { ModelState } from '@/components/core/enums/model-state'
import EInput from '@/components/core/components/input/EInput.vue'
import { InputControl } from '@/components/core/models/input/input-control'
import ECombobox from '@/components/core/components/combobox/ECombobox.vue'
import { ComboboxControl } from '@/components/core/models/combobox/combobox-control'
import { QuestionControl } from '@/models/question/question-control'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import ELoading from '@/components/core/components/loading/ELoading.vue'
import { LoadingType } from '@/components/core/enums/Common'
import EDate from '@/components/core/components/date/date-time/EDate.vue'
import { DateControl } from '@/components/core/models/date/date-control'
import ENumber from '@/components/core/components/number/ENumber.vue'
import { NumberControl } from '@/components/core/models/number/number-control'
import { TestMode } from '@/enums/test'
import { useRoute } from 'vue-router'
import { RouterNameTest } from '@/components/core/enums/Router'
import { ResultQuestion } from '@/models/result-question/result-question'
import { QuestionType } from '@/enums/question'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { AnswerQuestion } from '@/models/answer-question/answer-question'
import ExamService from '@/services/exam-service'
import { ExamDto } from '@/models/exam/Dto/exam-dto'
import questionHelper from '@/helper/question/question-helper'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import type { User } from '@/models/user/user'
import { LocalStorageKey } from '@/constants/local-storage-key'
export default {
  components: {
    EQuestion,
    EButton,
    ETableLabel,
    EInput,
    ECombobox,
    ELoading,
    EDate,
    ENumber,
  },
  props: {
    test: {
      type: TestDto,
      required: false,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const testMode = ref(TestMode.None)
    const masterData = ref(new TestDto(props.test))
    const saveBtn = ref(
      new ButtonControl({
        label: t('i18nTest.Button.Save'),
      }),
    )
    const isLoading = ref(false)
    const loadingControl = ref(
      new LoadingControl({
        type: LoadingType.LoadingNormal,
      }),
    )
    const inputControl = ref(
      new InputControl({
        placeholder: t('i18nTest.TestName'),
      }),
    )
    const startTimeControl = ref(new DateControl())
    const finishTimeControl = ref(new DateControl())
    const dicQuestionControl = ref<Record<string, QuestionControl>>({})
    const durationControl = ref(
      new NumberControl({
        min: 2,
        max: 10,
        placeholder: t('i18nTest.DurationTest'),
      }),
    )

    const fileInput = ref<File | null>(null)
    const fileInputRef = ref<HTMLElement | null>(null)
    const comboboxControl = ref(
      new ComboboxControl({
        placeholder: 'Nhập giá trị tìm kiếm',
        isOnlySelect: true,
        data: [
          {
            display: 'Anh',
            value: 1,
          },
          {
            display: 'Em',
            value: 2,
          },
        ],
      }),
    )
    const addQuestionBtn = ref(
      new ButtonControl({
        label: t('i18nQuestion.AddQuestion'),
      }),
    )
    const autoGenQuestionBtn = ref(
      new ButtonControl({
        label: t('i18nQuestion.AutoGenQuestion'),
      }),
    )
    const btnActionsQuestion = ref([
      new ButtonControl({
        label: t('i18nQuestion.Edit'),
        name: 'edit',
        classType: 'outline',
      }),
    ])
    const tableLabel = ref<TableLabelControl>(new TableLabelControl())
    tableLabel.value.displayValue = 'index'
    const questions = ref<Question[]>([])
    let questionsOrigin = [] as Question[]

    function validateInput() {
      return {
        isValid: false,
        message: 'Không hợp lệ',
      }
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
      const testId = commonFunction.generateID()
      const testService = new TestService()
      const result = await testService.getQuestionOfTest(testId)
      questions.value = result as unknown as Question[]
      tableLabel.value.data = questions.value.map((question, index) => {
        return new ItemTableLabel({
          value: question.question_id,
          data: { ...question, index: index + 1 },
        })
      })
    }
    function getQuestionControl(question: Question) {
      if (!question || !question.question_id) return
      if (!(question.question_id in dicQuestionControl.value)) {
        dicQuestionControl.value[question.question_id] = new QuestionControl({
          value: question,
        })
      }
      switch (testMode.value) {
        case TestMode.Do:
          dicQuestionControl.value[question.question_id].isShowToolEditor =
            false
          dicQuestionControl.value[question.question_id].readonly = true
          dicQuestionControl.value[question.question_id].isReadonlyToolEditor =
            true
          break
        case TestMode.Edit:
          dicQuestionControl.value[question.question_id].isShowToolEditor =
            false
          dicQuestionControl.value[question.question_id].isReadonlyToolEditor =
            true
          dicQuestionControl.value[question.question_id].isShowActionToolbar =
            true
          dicQuestionControl.value[question.question_id].isShowLevel = false
          dicQuestionControl.value[question.question_id].btnActions =
            btnActionsQuestion.value
          dicQuestionControl.value[question.question_id].customAction =
            handleActionQuestion
          break
      }
      return dicQuestionControl.value[question.question_id]
    }
    function handleActionQuestion(eventName: string, question: Question) {
      if (eventName && question) {
        const questionControl = dicQuestionControl.value[question.question_id]
        if (questionControl) {
          if (eventName == 'edit') {
            questionControl.isShowToolEditor = true
            questionControl.isReadonlyToolEditor = false
            questionControl.isShowQuestionType = true
            questionControl.readonly = false
            question.State =
              question.State == ModelState.INSERT
                ? ModelState.INSERT
                : ModelState.EDIT
            question.options?.forEach(o =>
              o.State == ModelState.INSERT || o.State == ModelState.DELETE
                ? o.State
                : question.State,
            )
            question.results?.forEach(r =>
              r.State == ModelState.INSERT || r.State == ModelState.DELETE
                ? r.State
                : question.State,
            )
          } else if (eventName == 'note') {
            questionControl.isShowNote = true
          }
        }
      }
    }
    async function handleLoadData() {
      const testService = new TestService()

      // Chuẩn bị các Promise cho các cuộc gọi API
      const tasks = []

      switch (testMode.value) {
        case TestMode.Add:
          masterData.value = new TestDto(masterData.value)
          masterData.value.State = ModelState.INSERT
          masterData.value.test_id = commonFunction.generateID()
          questions.value = []
          break
        case TestMode.Edit:
          tasks.push(testService.getById(masterData.value.test_id))
          tasks.push(
            testService.getQuestionOfTestEdit(masterData.value.test_id),
          )
          const [testDetailResult, questionsResult] = await Promise.all(tasks)
          masterData.value = testDetailResult as unknown as TestDto
          masterData.value.State = ModelState.EDIT
          // Xử lý kết quả
          questions.value = commonFunction.convertToInstances<Question>(
            questionsResult as unknown as Record<string, unknown>[],
            Question,
          )
          questionHelper.mapObjectContentQuestions(questions.value)
          questionsOrigin = commonFunction.convertToInstances<Question>(
            questionsResult as unknown as Record<string, unknown>[],
            Question,
          )
          questionHelper.mapObjectContentQuestions(questionsOrigin)
          break
        case TestMode.Do:
          tasks.push(testService.getInfoDoTest(masterData.value.test_id))

          const [testDetailDoResult] = await Promise.all(tasks)
          if ('test' in testDetailDoResult) {
            masterData.value = testDetailDoResult?.test as unknown as TestDto
            masterData.value.State = ModelState.VIEW
            if ('exam_id' in testDetailDoResult) {
              masterData.value.exam_id = testDetailDoResult.exam_id as string
            }
          }
          // Xử lý kết quả
          questions.value = commonFunction.convertToInstances<Question>(
            masterData.value.questions as unknown as Record<string, unknown>[],
            Question,
          )
          questionHelper.mapObjectContentQuestions(questions.value)
          questionsOrigin = commonFunction.convertToInstances<Question>(
            masterData.value.questions as unknown as Record<string, unknown>[],
            Question,
          )
          questionHelper.mapObjectContentQuestions(questionsOrigin)
          break
      }
    }
    function onAddQuestion() {
      const popupControl = new PopupControl({
        width: '1200px',
      })
      const component = import(
        '@views/test/popup-add-question/PopupAddQuestion.vue'
      )
      const methodHandle = (event: string, data: unknown) => {
        if (event == 'close') {
          popupControl.close()
        } else if (event == 'ok') {
          const questions = data as Question[]
          if (questions?.length) {
            handleAddQuestion(questions)
            popupControl.close()
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
        component,
        {
          control: popupControl,
        },
        methodHandle,
      )
    }
    function handleAddQuestion(items: Question[]) {
      if (!items || !items.length) return
      let startIndex = questions.value.length
      items.forEach(question => {
        startIndex += 1
        tableLabel.value.data.push(
          new ItemTableLabel({
            value: question.question_id,
            data: { ...question, index: startIndex },
          }),
        )
        if (!(question.question_id in dicQuestionControl.value)) {
          question.State = ModelState.INSERT
          question?.options?.forEach(o => (o.State = ModelState.INSERT))
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
    function onAutoGenQuestion() {
      const popupControl = new PopupControl({
        width: '1200px',
      })
      const component = import(
        '@views/test/popup-auto-gen-question/PopupAutoGenQuestion.vue'
      )
      const methodHandle = (event: string, data: unknown) => {
        if (event == 'close') {
          popupControl.close()
        } else if (event == 'ok') {
          const questions = data as Question[]
          if (questions?.length) {
            questions.forEach(q => {
              q.question_id = commonFunction.generateID()
              q.options?.forEach(o => {
                o.question_id = q.question_id
                o.option_question_id = commonFunction.generateID()
              })
              q.results?.forEach(o => {
                o.question_id = q.question_id
                o.result_question_id = commonFunction.generateID()
              })
            })
            handleAddQuestion(questions)
            popupControl.close()
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
        component,
        {
          control: popupControl,
        },
        methodHandle,
      )
    }
    // Object lưu trữ các refs động
    const questionRefs = ref<{ [key: string]: HTMLElement | null }>({})

    // Hàm để gán ref động theo index
    const setQuestionRef = (index: string) => (el: HTMLElement | null) => {
      if (el) {
        questionRefs.value[index] = el
      }
    }
    function changeLoading(loadingStatus: boolean = false) {
      isLoading.value = loadingStatus
    }
    function onSelectQuestionLabel(
      itemTableLabel: ItemTableLabel,
      index: string,
    ) {
      scrollToQuestion(index)
    }
    function onSelectLabel(item: ItemTableLabel) {
      if (item.value) {
        scrollToQuestion(item.value)
      }
    }
    function scrollToQuestion(questionId: string) {
      const target = questionRefs.value[questionId]
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        console.error(`Không tìm thấy phần tử với index ${questionId}`)
      }
    }
    async function onSave() {
      masterData.value.questions = questions.value
      switch (testMode.value) {
        case TestMode.Edit:
          const test = new TestDto(masterData.value)
          const testService = new TestService()
          let questionsHandle = questions.value.filter(
            q => q.State == ModelState.INSERT || q.State == ModelState.EDIT,
          )
          const questionOriginIds = new Set(
            (questions.value ?? []).map(question => question.question_id),
          )
          const questionsDelete = questionsOrigin.filter(
            q => !questionOriginIds.has(q.question_id),
          )
          if (questionsDelete?.length) {
            questionsDelete.forEach(q => (q.State = ModelState.DELETE))
            questionsHandle = questionsHandle.concat(questionsDelete)
          }
          questionHelper.mapQuestionToSave(questionsHandle)
          test.questions = questionsHandle
          if (masterData.value && masterData.value.State == ModelState.INSERT) {
            await testService.post(test)
          } else if (
            masterData.value &&
            masterData.value.State == ModelState.EDIT
          ) {
            await testService.put(test)
          }
          break
        case TestMode.Do:
          const examService = new ExamService()
          const answers = questions.value
            ?.filter(q => q.answer)
            .map(question => question.answer)
          const exam = new ExamDto({
            exam_id: masterData.value.exam_id,
            test_id: masterData.value.test_id,
            answers: (answers ?? []) as AnswerQuestion[],
          })
          await examService.doExam(exam)
          break
        case TestMode.Add:
          const testAdd = new TestDto(masterData.value)
          const testServiceAdd = new TestService()
          const questionsHandleAdd = questions.value
          questionsHandleAdd.forEach(q => {
            q.State = ModelState.INSERT
            q.content =
              typeof q.object_content == 'object' &&
              !Array.isArray(q.object_content)
                ? commonFunction.convertToString(
                    'ops' in q.object_content ? q.object_content.ops : [],
                  )
                : commonFunction.convertToString(q.object_content)
            q.options?.forEach(
              o =>
                (o.content =
                  typeof o.object_content == 'object' &&
                  !Array.isArray(o.object_content)
                    ? commonFunction.convertToString(
                        'ops' in o.object_content ? o.object_content.ops : [],
                      )
                    : commonFunction.convertToString(o.object_content)),
            )
          })
          testAdd.questions = questionsHandleAdd
          await testServiceAdd.post(testAdd)
      }
    }
    function initData() {
      const route = useRoute()
      switch (route.name) {
        case RouterNameTest.Add:
          masterData.value.test_id = commonFunction.generateID()
          const user = localStorageLibrary.getValueByKey<User>(
            LocalStorageKey.User,
          )
          if (user && user.user_id) {
            masterData.value.user_id = user.user_id
          }
          testMode.value = TestMode.Add
          break
        case RouterNameTest.Edit:
          masterData.value.test_id = route.params.test_id as string
          testMode.value = TestMode.Edit
          break
        case RouterNameTest.Do:
          masterData.value.test_id = route.params.test_id as string
          testMode.value = TestMode.Do
          break
        default:
          testMode.value = TestMode.None
      }
    }
    function initControl() {
      switch (testMode.value) {
        case TestMode.Add:
          inputControl.value.readonly = false
          startTimeControl.value.readonly = false
          durationControl.value.readonly = false
          break
        case TestMode.Edit:
          inputControl.value.readonly = false
          startTimeControl.value.readonly = false
          durationControl.value.readonly = false
          break
        case TestMode.Do:
          inputControl.value.readonly = true
          startTimeControl.value.readonly = true
          durationControl.value.readonly = true
          break
        case TestMode.History:
          inputControl.value.readonly = true
          startTimeControl.value.readonly = true
          durationControl.value.readonly = true
          break
        default:
          testMode.value = TestMode.None
      }
    }
    function onChangeAnswer(question: Question, answer: string) {
      if (testMode.value == TestMode.Edit) {
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
      } else if (testMode.value == TestMode.Do) {
        let newContent = ''
        switch (question.type) {
          case QuestionType.MultiChoice:
          case QuestionType.SingleChoice:
            newContent = answer
            break
          case QuestionType.FillResult:
            const objectContent = commonFunction.convertToData<object>(answer)
            newContent =
              'ops' in objectContent
                ? commonFunction.convertToString(objectContent.ops)
                : '[]'
            break
        }
        if (!question.answer) {
          question.answer = new AnswerQuestion({
            answer_id: commonFunction.generateID(),
            exam_id: masterData.value.exam_id,
            question_id: question.question_id,
            content: newContent,
            State: ModelState.INSERT,
          })
        } else {
          question.answer.content = newContent
          question.answer.State =
            question.answer.State != ModelState.INSERT
              ? ModelState.EDIT
              : ModelState.INSERT
        }
      }
    }
    return {
      testMode,
      TestMode,
      masterData,
      saveBtn,
      btnActionsQuestion,
      dicQuestionControl,
      startTimeControl,
      finishTimeControl,
      durationControl,
      loadingControl,
      isLoading,
      changeLoading,
      getQuestionControl,
      comboboxControl,
      inputControl,
      fileInputRef,
      addQuestionBtn,
      autoGenQuestionBtn,
      onAutoGenQuestion,
      tableLabel,
      handleLoadData,
      fileInput,
      validateInput,
      testUploadFile,
      setQuestionRef,
      scrollToQuestion,
      questions,
      questionsOrigin,
      getQuestion,
      questionRefs,
      onSelectQuestionLabel,
      onAddQuestion,
      handleAddQuestion,
      onSelectLabel,
      onSave,
      initData,
      initControl,
      onChangeAnswer,
    }
  },
  created() {
    this.initData()
    this.initControl()
  },
  mounted() {
    this.handleLoadData()
  },
}
</script>

<template src="./test-detail.html"></template>
<style src="./test-detail.scss" lang="scss"></style>

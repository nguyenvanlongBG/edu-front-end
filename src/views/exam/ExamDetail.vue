<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import EQuestion from '@/components/question/EQuestion.vue'
import ETableLabel from '@/components/core/components/table-label/ETableLabel.vue'
import { Question } from '@/models/question/question'
import TestService from '@/services/test-service'
import FileQuestionService from '@/services/file-question-service'

import { ref } from 'vue'
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
import { ExamMode } from '@/enums/exam'
import { useRoute } from 'vue-router'
import { RouterNameExam } from '@/components/core/enums/Router'
import { ExamDto } from '@/models/exam/Dto/exam-dto'
import ExamService from '@/services/exam-service'
import { AnswerQuestion } from '@/models/answer-question/answer-question'
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
    exam: {
      type: ExamDto,
      required: false,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const examMode = ref(ExamMode.None)
    const masterData = ref(new ExamDto(props.exam))
    const test = ref(new TestDto())
    masterData.value.State = ModelState.INSERT
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
        label: t('i18nQuestion.CreateQuestion'),
      }),
    )
    const tableLabel = ref<TableLabelControl>(new TableLabelControl())
    tableLabel.value.displayValue = 'index'
    const questions = ref<Question[]>([])
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
      switch (examMode.value) {
        case ExamMode.Do:
          dicQuestionControl.value[question.question_id].isShowToolEditor =
            false
          dicQuestionControl.value[question.question_id].readonly = true
          break
        case ExamMode.History:
          dicQuestionControl.value[question.question_id].isShowAnswer = true
          dicQuestionControl.value[question.question_id].isShowResult = true
      }
      return dicQuestionControl.value[question.question_id]
    }
    async function handleLoadData() {
      const examService = new ExamService()
      const tasks = []
      switch (examMode.value) {
        case ExamMode.Do:
          tasks.push(examService.getTestOfExam(masterData.value.exam_id))
          const [testDetailResult] = await Promise.all(tasks)
          test.value = testDetailResult as unknown as TestDto
          masterData.value.test_id = test.value.test_id
          // Xử lý kết quả
          questions.value = commonFunction.convertToInstances<Question>(
            test.value.questions as unknown as Record<string, unknown>[],
            Question,
          )
          break
        case ExamMode.History:
          tasks.push(examService.historyExam(masterData.value.exam_id))
          const [testHistory] = await Promise.all(tasks)
          test.value = testHistory as unknown as TestDto
          masterData.value.test_id = test.value.test_id
          // Xử lý kết quả
          questions.value = commonFunction.convertToInstances<Question>(
            test.value.questions as unknown as Record<string, unknown>[],
            Question,
          )
          break
      }
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
      const answers = questions.value
        ?.filter(q => q.answer)
        .map(question => question.answer)

      masterData.value.answers = answers as AnswerQuestion[]
      const examService = new ExamService()
      switch (examMode.value) {
        case ExamMode.Do:
          await examService.doExam(masterData.value)
          break
        case ExamMode.Mark:
          break
      }
    }

    function initData() {
      const route = useRoute()
      masterData.value.exam_id = route.params.exam_id as string
      switch (route.name) {
        case RouterNameExam.Do:
          examMode.value = ExamMode.Do
          break
        case RouterNameExam.Mark:
          examMode.value = ExamMode.Mark
          break
        case RouterNameExam.History:
          examMode.value = ExamMode.History
          break
        default:
          examMode.value = ExamMode.None
      }
    }
    function initControl() {
      inputControl.value.readonly = true
      startTimeControl.value.readonly = true
      durationControl.value.readonly = true
      switch (examMode.value) {
        case ExamMode.History:
          break
      }
    }
    function onChangeAnswer(question: Question, answer: string) {
      if (examMode.value == ExamMode.Do) {
        if (!question.answer) {
          question.answer = new AnswerQuestion({
            exam_id: masterData.value.exam_id,
            answer_id: commonFunction.generateID(),
            question_id: question.question_id,
            State: ModelState.INSERT,
          })
        } else if (question.answer.State == ModelState.VIEW) {
          question.answer.State = ModelState.EDIT
        }
        question.answer.content = answer
      }
    }
    return {
      examMode,
      test,
      ExamMode,
      masterData,
      saveBtn,
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
      tableLabel,
      handleLoadData,
      fileInput,
      validateInput,
      testUploadFile,
      setQuestionRef,
      scrollToQuestion,
      questions,
      getQuestion,
      questionRefs,
      onSelectQuestionLabel,
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

<template src="./exam-detail.html"></template>
<style src="./exam-detail.scss" lang="scss"></style>

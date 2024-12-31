<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import EQuestion from '@/components/question/EQuestion.vue'
import ETableLabel from '@/components/core/components/table-label/ETableLabel.vue'
import { Question } from '@/models/question/question'
import TestService from '@/services/test-service'
import FileQuestionService from '@/services/file-question-service'

import { ref, nextTick } from 'vue'
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
import { OptionQuestion } from '@/models/option-question/option-question'
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
      switch (testMode.value) {
        case TestMode.Do:
          dicQuestionControl.value[question.question_id].isShowToolEditor =
            false
          dicQuestionControl.value[question.question_id].readonly = true
          break
        case TestMode.Edit:
          dicQuestionControl.value[question.question_id].isShowToolEditor = true
          dicQuestionControl.value[question.question_id].isShowActionToolbar =
            true
          dicQuestionControl.value[question.question_id].isShowLevel = true
          break
      }
      return dicQuestionControl.value[question.question_id]
    }
    function onImportQuestion() {
      // Kích hoạt input file ẩn
      if (fileInputRef.value) {
        fileInputRef.value.click()
      }
    }
    async function handleLoadData() {
      const testService = new TestService()

      // Chuẩn bị các Promise cho các cuộc gọi API
      const tasks = []

      switch (testMode.value) {
        case TestMode.Add:
          masterData.value = new TestDto()
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
          // Xử lý kết quả
          questions.value = commonFunction.convertToInstances<Question>(
            questionsResult as unknown as Record<string, unknown>[],
            Question,
          )
          break
      }
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
    // Object lưu trữ các refs động
    const questionRefs = ref<{ [key: string]: HTMLElement | null }>({})

    // Hàm để gán ref động theo index
    const setQuestionRef = (index: string) => (el: HTMLElement | null) => {
      if (el) {
        questionRefs.value[index] = el
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
      if (masterData.value && masterData.value.State == ModelState.INSERT) {
        const testService = new TestService()
        await testService.post(masterData.value)
      }
    }
    function initData() {
      const route = useRoute()
      masterData.value.test_id = route.params.test_id as string
      switch (route.name) {
        case RouterNameTest.Add:
          testMode.value = TestMode.Add
          break
        case RouterNameTest.Edit:
          testMode.value = TestMode.Edit
          break
        case RouterNameTest.Do:
          testMode.value = TestMode.Do
          break
        case RouterNameTest.History:
          testMode.value = TestMode.History
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
          })
          question.results.push(result)
        }
        switch (question.type) {
          case QuestionType.SingleChoice:
            const resultTmpSi = question.results[0]
            resultTmpSi.content = answer
            break
          case QuestionType.MultiChoice:
            const resultTmpMu = question.results[0]
            resultTmpMu.content = answer
            break
        }
      }
    }
    return {
      testMode,
      TestMode,
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
      handleFileChange,
      onImportQuestion,
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

<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import EButton from '@/components/core/components/button/EButton.vue'
import ECheckbox from '@/components/core/components/checkbox/ECheckbox.vue'
import EMultiCombobox from '@/components/core/components/e-multi-combobox/EMultiCombobox.vue'
import EPaging from '@/components/core/components/paging/EPaging.vue'
import EPopup from '@/components/core/components/popup/EPopup.vue'
import {
  FilterOperator,
  LoadingType,
  LogicalOperator,
} from '@/components/core/enums/Common'
import { ModelState } from '@/components/core/enums/model-state'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { CheckboxControl } from '@/components/core/models/checkbox/checkbox-control'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import { MultiComboboxControl } from '@/components/core/models/multi-combobox/multi-combobox-control'
import { FilterCondition } from '@/components/core/models/paging/filter-condition'
import { PagingControl } from '@/components/core/models/paging/paging-control'
import { PagingParam } from '@/components/core/models/paging/paging-param'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import EQuestion from '@/components/question/EQuestion.vue'
import { GuidEmpty } from '@/constants/consstant'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { QuestionType } from '@/enums/question'
import questionHelper from '@/helper/question/question-helper'
import { Question } from '@/models/question/question'
import { QuestionControl } from '@/models/question/question-control'
import type { User } from '@/models/user/user'
import ChapterService from '@/services/chapter-service'
import QuestionService from '@/services/question-service'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  components: {
    EQuestion,
    EButton,
    EPopup,
    EPaging,
    EMultiCombobox,
    ECheckbox,
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
    const questionSelected = ref([] as Question[])
    const loadingControl = ref(
      new LoadingControl({
        type: LoadingType.LoadingNormal,
      }),
    )
    const checkBoxControl = ref(new CheckboxControl())
    const chapterControl = ref(
      new MultiComboboxControl({
        displayField: 'name',
        valueField: 'chapter_id',
        data: [],
        readonly: true,
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
          isShowResult: true,
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
      const result = await questionService.getPagingQuestionLibrary(pagingParam)
      questions.value = commonFunction.convertToInstances<Question>(
        result as unknown as Record<string, unknown>[],
        Question,
      )
      questions.value.forEach(question => {
        question.State = ModelState.INSERT
        question.question_id = commonFunction.generateID()
        question.options?.forEach(option => {
          option.State = ModelState.INSERT
          const newOptionQuestionId = commonFunction.generateID()
          if (
            question.type == QuestionType.SingleChoice ||
            question.type == QuestionType.MultiChoice
          ) {
            question.results?.forEach(result => {
              if (result.content?.includes(option.option_question_id)) {
                // Thay thế giá trị trong result.content
                result.content = result.content.replace(
                  option.option_question_id,
                  newOptionQuestionId, // Giá trị thay thế (thay "new_value" bằng giá trị bạn muốn)
                )
              }
            })
          }
          option.option_question_id = newOptionQuestionId
          option.question_id = question.question_id
        })
        question.results?.forEach(result => {
          result.result_question_id = commonFunction.generateID()
          result.question_id = question.question_id
          result.State = ModelState.INSERT
        })
      })
      questionHelper.mapQuestionsToUI(questions.value)
      isLoading.value = false
    }
    function onSave() {
      const control = props.control
      if (control && typeof control.handleEmit == 'function') {
        control.handleEmit('ok', questionSelected.value)
      }
    }
    function buildFilterQuestion() {
      const filters = [] as FilterCondition[]
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (user && user.user_id) {
        filters.push(
          new FilterCondition({
            Field: 'user_id',
            Operator: FilterOperator.Equal,
            Value: user?.user_id,
            LogicalOperator: LogicalOperator.OR,
            SubConditions: [
              new FilterCondition({
                Field: 'user_id',
                Operator: FilterOperator.Equal,
                Value: GuidEmpty,
              }),
            ],
          }),
        )
      }
      filters.push(
        new FilterCondition({
          Field: 'from',
          Operator: FilterOperator.Equal,
          Value: 0,
        }),
      )
      return filters
    }
    function buildPagingParam() {
      const param = new PagingParam()
      param.page =
        pagingControl.value.currentPage > 0
          ? pagingControl.value.currentPage
          : 1
      param.filters = buildFilterQuestion()
      return param
    }
    async function onChangePage(page: number) {
      pagingControl.value.currentPage = page
      const pagingParam = buildPagingParam()
      await handleLoadData(pagingParam)
    }
    function onSelectedQuestion(checked: boolean, question: Question) {
      if (checked) {
        const indexExisted = questionSelected.value.findIndex(
          q => q.question_id == question.question_id,
        )
        if (indexExisted < 0) {
          questionSelected.value.push(question)
        }
      } else {
        questionSelected.value = questionSelected.value.filter(
          q => q.question_id != question.question_id,
        )
      }
    }
    return {
      isLoading,
      questionSelected,
      checkBoxControl,
      buildPagingParam,
      buildFilterQuestion,
      loadingControl,
      chapterControl,
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
      onSelectedQuestion,
      onSave,
      onChangePage,
    }
  },
  async mounted() {
    const chapterService = new ChapterService()
    const resultChapter = await chapterService.filter([])
    this.chapterControl.data = (resultChapter ?? []) as unknown as Array<
      Record<string, unknown>
    >
    const param = this.buildPagingParam()
    await this.handleLoadData(param)
    const questionService = new QuestionService()
    const result = await questionService.getSummary(param)
    this.pagingControl.currentPage = 1
    this.pagingControl.totalPage = Math.ceil(
      (result as unknown as number) /
        (this.pagingControl.value.take > 0 ? this.pagingControl.value.take : 1),
    )
  },
}
</script>
<template src="./popup-choice-question-library.html"></template>
<style src="./popup-choice-question-library.scss" lang="scss" />

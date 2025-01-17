<template src="./e-question.html"></template>
<style src="./e-question.scss" scoped lang="scss"></style>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { QuestionType, QuestionMode, QuestionLevel } from '@/enums/question' // Giả sử các enum đã được định nghĩa đúng cách
import { EditorControl } from '../core/models/editor/editor-control'
import Editor from '@core/components/editor/EEditor.vue'
import { OptionQuestion } from '@/models/option-question/option-question'
import ECombobox from '../core/components/combobox/ECombobox.vue'
import { QuestionControl } from '@/models/question/question-control'
import { ComboboxControl } from '../core/models/combobox/combobox-control'
import EButton from '../core/components/button/EButton.vue'
import { ButtonControl } from '../core/models/button/button-control'
import { useI18n } from 'vue-i18n'
import ENote from '../core/components/note/ENote.vue'
import ENumber from '../core/components/number/ENumber.vue'
import { NumberControl } from '../core/models/number/number-control'
import commonFunction from '../core/commons/CommonFunction'
import type { Question } from '@/models/question/question'
import { ModelState } from '../core/enums/model-state'

export default defineComponent({
  name: 'EQuestion',
  components: {
    Editor,
    ECombobox,
    ENumber,
    EButton,
    ENote,
  },
  props: {
    control: {
      type: QuestionControl,
      required: true,
    },
  },
  watch: {
    'control.readonly': function (newValue: boolean) {
      if (newValue && !this.control.isShowToolEditor) {
        this.questionEditorControl.isHideToolbar = true
        this.questionEditorControl.readonly = true
      }
    },
    'control.isShowToolEditor': function (newValue: boolean) {
      if (newValue) {
        this.questionEditorControl.isHideToolbar = false
      } else {
        this.questionEditorControl.isHideToolbar = true
      }
    },
    'control.isReadonlyToolEditor': function (newValue: boolean) {
      if (newValue) {
        this.questionEditorControl.readonly = true
      } else {
        this.questionEditorControl.readonly = false
      }
    },
  },
  emits: ['change-answer', 'change-point'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const questionEditorControl = ref(new EditorControl())
    const questionTypeControl = ref(
      new ComboboxControl({
        value: QuestionType.SingleChoice,
        bindingText: t('i18nQuestion.SingleChoice'),
        isOnlySelect: true,
        data: [
          {
            display: t('i18nQuestion.SingleChoice'),
            value: QuestionType.SingleChoice,
          },
          {
            display: t('i18nQuestion.MultiChoice'),
            value: QuestionType.MultiChoice,
          },
          {
            display: t('i18nQuestion.FillResult'),
            value: QuestionType.FillResult,
          },
        ],
      }),
    )
    const questionLevelControl = ref(
      new ComboboxControl({
        value: QuestionLevel.Recognition,
        bindingText: t('i18nQuestion.Recognition'),
        isOnlySelect: true,
        width: '200px',
        data: [
          {
            display: t('i18nQuestion.Recognition'),
            value: QuestionLevel.Recognition,
          },
          {
            display: t('i18nQuestion.Comprehension'),
            value: QuestionLevel.Comprehension,
          },
          {
            display: t('i18nQuestion.Application'),
            value: QuestionLevel.Application,
          },
          {
            display: t('i18nQuestion.AdvancedApplication'),
            value: QuestionLevel.AdvancedApplication,
          },
        ],
      }),
    )
    const pointControl = ref(new NumberControl())
    function getClassForOption(option: OptionQuestion) {
      const question = props.control.value
      const control = props.control
      if (
        !question ||
        !(
          question.type == QuestionType.SingleChoice ||
          question.type == QuestionType.MultiChoice
        ) ||
        !option
      )
        return ''
      if (control.isShowAnswer && control.isShowResult) {
        switch (question.type) {
          case QuestionType.SingleChoice:
            if (
              question.results &&
              question.results.length &&
              question.answer
            ) {
              if (question.results[0].content == question.answer.content)
                return 'correct'
              return 'incorrect'
            }
            break
          case QuestionType.MultiChoice:
            if (
              question.results &&
              question.results.length &&
              question.answer
            ) {
              // Chuyển chuỗi thành mảng
              const resultIds = question.results[0].content
                ?.split(',')
                .map(id => id.trim())
              const answerIds = question.answer.content
                ?.split(',')
                .map(id => id.trim())

              // So sánh nếu cùng danh sách
              const isEqual =
                resultIds.length === answerIds.length &&
                resultIds.sort().join(',') === answerIds.sort().join(',')

              return isEqual ? 'correct' : 'incorrect'
            }
        }
      }
    }
    function initControls() {
      const question = props.control.value as Question
      const questionControl = props.control
      if (questionControl && !questionControl.isShowToolEditor) {
        questionEditorControl.value.isHideToolbar = true
        questionEditorControl.value.readonly = true
      }
      questionTypeControl.value.value = question.type
      switch (question.type) {
        case QuestionType.SingleChoice:
          questionTypeControl.value.bindingText = t('i18nQuestion.SingleChoice')
          break
        case QuestionType.MultiChoice:
          questionTypeControl.value.bindingText = t('i18nQuestion.MultiChoice')
          break
        case QuestionType.FillResult:
          questionTypeControl.value.bindingText = t('i18nQuestion.FillResult')
          break
      }

      questionLevelControl.value.value = question.level
      switch (question.level) {
        case QuestionLevel.Recognition:
          questionLevelControl.value.bindingText = t('i18nQuestion.Recognition')
          break
        case QuestionLevel.Comprehension:
          questionLevelControl.value.bindingText = t(
            'i18nQuestion.Comprehension',
          )
          break
        case QuestionLevel.Application:
          questionLevelControl.value.bindingText = t('i18nQuestion.Application')
          break
        case QuestionLevel.AdvancedApplication:
          questionLevelControl.value.bindingText = t(
            'i18nQuestion.AdvancedApplication',
          )
          break
      }

      if (question && question.answer && question.answer.content) {
        switch (question.type) {
          case QuestionType.SingleChoice:
            singleOptionSelected.value = question.answer.content
            break
          case QuestionType.MultiChoice:
            multiOptionSelected.value = question.answer.content.split(',')
            break
          case QuestionType.FillResult:
            const contentFillAnswer = commonFunction.convertToData<object[]>(
              question.answer.content,
            )
            fillResult.value = contentFillAnswer
            break
        }
      }
      if (question && question.results && question.results.length) {
        switch (question.type) {
          case QuestionType.SingleChoice:
            singleOptionSelected.value = question.results[0].content
            break
          case QuestionType.MultiChoice:
            multiOptionSelected.value = question.results[0].content.split(',')
            break
          case QuestionType.FillResult:
            if (question.results?.length) {
              const contentFillResult = commonFunction.convertToData<object[]>(
                question.results[0].content,
              )
              fillResult.value = contentFillResult
            }
            break
        }
      }
      if (props.control.isShowLevel && props.control.isReadonlyLevel) {
        questionLevelControl.value.readonly = true
      }
      if (props.control.isShowPoint && props.control.isReadonlyPoint) {
        pointControl.value.readonly = true
      }
    }
    function onActionQuestion(button: ButtonControl) {
      const control = props.control
      if (
        control &&
        control.customAction &&
        typeof control.customAction == 'function'
      ) {
        control.customAction(button.name, control.value)
      }
    }
    const singleOptionSelected = ref('')
    const fillResult = ref([] as object[])
    const multiOptionSelected = ref([] as string[])
    function onChangeChoice() {
      const question = props.control.value
      if (question) {
        switch (question.type) {
          case QuestionType.SingleChoice:
            emit('change-answer', question, singleOptionSelected.value)
            break
          case QuestionType.MultiChoice:
            emit('change-answer', question, multiOptionSelected.value.join(','))
            break
        }
      }
    }
    function onAddOption() {
      const control = props.control
      if (control.isReadonlyToolEditor) return
      const question = props.control.value
      if (
        question.type == QuestionType.SingleChoice ||
        question.type == QuestionType.MultiChoice
      ) {
        if (!question.options) question.options = []
        question.options.push(
          new OptionQuestion({
            option_question_id: commonFunction.generateID(),
            content: '',
            object_content: [],
            question_id: question.question_id,
            State: ModelState.INSERT,
          }),
        )
      }
    }
    function onUpdateFillResult() {
      const question = props.control.value
      emit(
        'change-answer',
        question,
        commonFunction.convertToString(fillResult.value),
      )
    }
    function onUpdatePoint(point: number) {
      const question = props.control.value
      emit('change-point', question, point)
    }
    return {
      QuestionMode,
      questionLevelControl,
      pointControl,
      onUpdatePoint,
      onActionQuestion,
      initControls,
      questionTypeControl,
      QuestionType,
      questionEditorControl,
      getClassForOption,
      singleOptionSelected,
      multiOptionSelected,
      fillResult,
      onUpdateFillResult,
      onChangeChoice,
      onAddOption,
    }
  },
  created() {},
  mounted() {
    this.initControls()
  },
})
</script>

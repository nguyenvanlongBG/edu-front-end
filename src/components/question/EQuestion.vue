<template src="./e-question.html"></template>
<style src="./e-question.scss" scoped lang="scss"></style>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { QuestionType, QuestionMode } from '@/enums/question' // Giả sử các enum đã được định nghĩa đúng cách
import { EditorControl } from '../core/models/editor/editor-control'
import Editor from '@core/components/editor/EEditor.vue'
import type { OptionQuestion } from '@/models/option-question/option-question'
import ECombobox from '../core/components/combobox/ECombobox.vue'
import { QuestionControl } from '@/models/question/question-control'
import { ComboboxControl } from '../core/models/combobox/combobox-control'
import EButton from '../core/components/button/EButton.vue'
import { ButtonControl } from '../core/models/button/button-control'
import { useI18n } from 'vue-i18n'
import { NoteControl } from '../core/models/note/note-control'
import ENote from '../core/components/note/ENote.vue'
import ENumber from '../core/components/number/ENumber.vue'
import { NumberControl } from '../core/models/number/number-control'
import commonFunction from '../core/commons/CommonFunction'

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
  emits: ['change-answer'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const questionEditorControl = ref(new EditorControl())
    const noteEditorControl = ref(new NoteControl())
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
              if (
                question.results[0].result_question_id ==
                question.answer.content
              )
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
              return 'incorrect'
            }
            return 'correct'
        }
      }
    }
    function initControls() {
      const question = props.control.value
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
            multiOptionSelected.value = question.results.map(
              answer => answer.content,
            )
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
        questionTypeControl.value.readonly = true
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
      } else {
        questionEditorControl.value.isHideToolbar = false
        questionEditorControl.value.readonly = false
        control.isShowQuestionType = true
        control.readonly = false
      }
    }
    function onNoteQuestion() {
      const control = props.control
      if (control) {
        control.isShowNote = true
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
    function onUpdateFillResult() {
      const question = props.control.value
      emit(
        'change-answer',
        question,
        commonFunction.convertToString(fillResult.value),
      )
    }
    return {
      QuestionMode,
      noteEditorControl,
      pointControl,
      onActionQuestion,
      onNoteQuestion,
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
    }
  },
  created() {},
  mounted() {
    this.initControls()
  },
})
</script>

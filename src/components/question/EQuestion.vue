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

export default defineComponent({
  name: 'EQuestion',
  components: {
    Editor,
    ECombobox,
    EButton,
  },
  props: {
    control: {
      type: QuestionControl,
      required: true,
    },
  },
  emits: ['change-answer'],
  setup(props, ctx) {
    const { t } = useI18n()
    const questionEditorControl = ref(new EditorControl())
    const noteEditorControl = ref(new EditorControl())
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
        ],
      }),
    )
    const btnEdit = ref(
      new ButtonControl({
        label: t('i18nQuestion.Edit'),
        classType: 'outline',
      }),
    )
    const btnNote = ref(
      new ButtonControl({
        label: t('i18nQuestion.Note'),
        classType: 'outline',
      }),
    )
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
        }
      }
      if (props.control.isShowLevel && props.control.isReadonlyLevel) {
        questionTypeControl.value.readonly = true
      }
    }
    function onEditQuestion() {
      const control = props.control
      if (
        control &&
        control.customAction &&
        typeof control.customAction == 'function'
      ) {
        control.customAction('edit')
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
    const multiOptionSelected = ref([] as string[])
    function onChangeChoice() {
      const question = props.control.value
      if (question) {
        switch (question.type) {
          case QuestionType.SingleChoice:
            ctx.emit('change-answer', question, singleOptionSelected.value)
            break
          case QuestionType.MultiChoice:
            ctx.emit(
              'change-answer',
              question,
              multiOptionSelected.value.join(','),
            )
            break
        }
      }
    }
    return {
      QuestionMode,
      noteEditorControl,
      btnEdit,
      btnNote,
      onEditQuestion,
      onNoteQuestion,
      initControls,
      questionTypeControl,
      QuestionType,
      questionEditorControl,
      getClassForOption,
      singleOptionSelected,
      multiOptionSelected,
      onChangeChoice,
    }
  },
  created() {},
  mounted() {
    this.initControls()
  },
})
</script>

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
  setup(props) {
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
        ],
      }),
    )
    const btnEdit = ref(
      new ButtonControl({
        label: t('i18nQuestion.Edit'),
        classType: 'outline',
      }),
    )
    function getClassForOption(option: OptionQuestion) {
      let classType = ''
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
      if (control.isShowResult && question.results && question.results.length) {
        for (let index = 0; index < question.results.length; index++) {
          const result = question.results[index]
          if (result.content.includes(option.option_question_id)) {
            classType = 'neutral'
            break
          }
        }
      }
      if (control.isShowAnswer) {
        if (question.answers && question.answers.length) {
          const isCheck = question.answers.find(answer =>
            answer.content.includes(option.option_question_id),
          )
          if (!isCheck) return classType
          const result = question.results?.map(result => result.content)
          if (!result) return classType
          for (let index = 0; index < question.answers.length; index++) {
            const answer = question.answers[index]
            if (result.includes(answer.content)) {
              classType = 'correct'
              return classType
            } else {
              classType = 'incorrect'
              return classType
            }
          }
          return classType
        }
      }
      return classType
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

      if (question && question.answers && question.answers.length) {
        switch (question.type) {
          case QuestionType.SingleChoice:
            singleOptionSelected.value = question.answers[0].content
            break
          case QuestionType.MultiChoice:
            multiOptionSelected.value = question.answers.map(
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
    const singleOptionSelected = ref('')
    const multiOptionSelected = ref([] as string[])

    return {
      QuestionMode,
      btnEdit,
      onEditQuestion,
      initControls,
      questionTypeControl,
      QuestionType,
      questionEditorControl,
      getClassForOption,
      singleOptionSelected,
      multiOptionSelected,
    }
  },
  created() {
    this.initControls()
  },
})
</script>

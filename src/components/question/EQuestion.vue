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

export default defineComponent({
  name: 'EQuestion',
  components: {
    Editor,
    ECombobox,
  },
  props: {
    control: {
      type: QuestionControl,
      required: true,
    },
  },
  setup(props) {
    const questionEditorControl = ref(new EditorControl())
    const questionTypeControl = ref(
      new ComboboxControl({
        data: [
          {
            display: 'Single',
            value: QuestionType.SingleChoice,
          },
          {
            display: 'Multi',
            value: QuestionType.MultiChoice,
          },
        ],
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
    const singleOptionSelected = ref('')
    const multiOptionSelected = ref([] as string[])

    return {
      QuestionMode,
      questionTypeControl,
      QuestionType,
      questionEditorControl,
      getClassForOption,
      singleOptionSelected,
      multiOptionSelected,
    }
  },
  created() {
    const question = this.control.value
    if (
      question &&
      (question.mode == QuestionMode.Do ||
        question.mode == QuestionMode.ViewOnly)
    ) {
      this.questionEditorControl.isHideToolbar = true
    }
  },
  mounted() {
    const question = this.control.value
    if (question && question.answers && question.answers.length) {
      switch (question.type) {
        case QuestionType.SingleChoice:
          this.singleOptionSelected = question.answers[0].content
          break
        case QuestionType.MultiChoice:
          this.multiOptionSelected = question.answers.map(
            answer => answer.content,
          )
          break
      }
    }
  },
  // Tiếp theo là phần logic xử lý
})
</script>

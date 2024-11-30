<template src="./e-question.html"></template>
<style src="./e-question.scss" scoped lang="scss"></style>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { QuestionType, QuestionMode } from '@/enums/question' // Giả sử các enum đã được định nghĩa đúng cách
import { EditorControl } from '../core/models/editor/editor-control'
import Editor from '@core/components/editor/EEditor.vue'
import { Question } from '@/models/question/question'
import type { OptionQuestion } from '@/models/option-question/option-question'

export default defineComponent({
  name: 'EQuestion',
  components: {
    Editor,
  },
  props: {
    question: {
      type: Question,
      required: true,
      default: () => new Question(),
    },
    isShowAnswer: {
      type: Boolean,
      default: false,
    },
    isShowResult: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const questionControl = ref(new EditorControl())
    function getClassForOption(option: OptionQuestion) {
      let classType = ''
      if (
        !props.question ||
        !(
          props.question.type == QuestionType.SingleChoice ||
          props.question.type == QuestionType.MultiChoice
        ) ||
        !option
      )
        return ''
      if (
        props.isShowResult &&
        props.question.results &&
        props.question.results.length
      ) {
        for (let index = 0; index < props.question.results.length; index++) {
          const result = props.question.results[index]
          if (result.content.includes(option.option_question_id)) {
            classType = 'neutral'
            break
          }
        }
      }
      if (props.isShowAnswer) {
        if (props.question.answers && props.question.answers.length) {
          const isCheck = props.question.answers.find(answer =>
            answer.content.includes(option.option_question_id),
          )
          if (!isCheck) return classType
          const result = props.question.results?.map(result => result.content)
          if (!result) return classType
          for (let index = 0; index < props.question.answers.length; index++) {
            const answer = props.question.answers[index]
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
      QuestionType,
      questionControl,
      getClassForOption,
      singleOptionSelected,
      multiOptionSelected,
    }
  },
  mounted() {
    if (
      this.question &&
      this.question.answers &&
      this.question.answers.length
    ) {
      switch (this.question.type) {
        case QuestionType.SingleChoice:
          this.singleOptionSelected = this.question.answers[0].content
          break
        case QuestionType.MultiChoice:
          this.multiOptionSelected = this.question.answers.map(
            answer => answer.content,
          )
          break
      }
    }
  },
  // Tiếp theo là phần logic xử lý
})
</script>

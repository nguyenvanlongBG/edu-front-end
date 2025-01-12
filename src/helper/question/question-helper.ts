import commonFunction from '@/components/core/commons/CommonFunction'
import { QuestionType } from '@/enums/question'
import type { Question } from '@/models/question/question'

class QuestionHelper {
  mapObjectContentQuestion(question: Question) {
    if (question) {
      question.object_content = commonFunction.convertToData<object[]>(
        question.content,
      )
      question.options?.forEach(
        option =>
          (option.object_content = commonFunction.convertToData<object[]>(
            option.content,
          )),
      )
      question.results?.forEach(result => {
        if (question.type == QuestionType.FillResult) {
          result.object_content = commonFunction.convertToData<object[]>(
            result.content,
          )
        }
      })
    }
  }
  mapContentQuestion(question: Question) {
    if (question) {
      question.content = commonFunction.convertToString(
        question.object_content ?? [],
      )
      question.options?.forEach(
        option =>
          (option.content = commonFunction.convertToString(
            option.object_content ?? [],
          )),
      )
      question.results?.forEach(result => {
        if (question.type == QuestionType.FillResult) {
          result.content = commonFunction.convertToString(
            result.object_content ?? [],
          )
        }
      })
    }
  }
  mapObjectContentQuestions(questions: Question[]) {
    if (questions?.length) {
      questions.forEach(question => {
        this.mapObjectContentQuestion(question)
      })
    }
  }
  mapQuestionToSave(questions: Question[]) {
    if (questions?.length) {
      questions.forEach(question => {
        this.mapContentQuestion(question)
        question.chapter_ids = question.lstChapterId?.length
          ? question.lstChapterId?.join(',')
          : ''
      })
    }
  }
  mapQuestionsToUI(questions: Question[]) {
    this.mapObjectContentQuestions(questions)
    questions?.forEach(question => {
      question.lstChapterId = question.chapter_ids?.split(',')
    })
  }
}
const questionHelper = new QuestionHelper()
export default questionHelper

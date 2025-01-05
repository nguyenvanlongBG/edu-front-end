import { BaseEntity } from '../base/base-entity'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { IChapter } from './i-chapter'

export class Chapter extends BaseEntity {
  constructor(chapter?: IChapter) {
    super()
    if (chapter) {
      commonFunction.assignProperties(
        this as Record<string, unknown>,
        chapter as unknown as Record<string, unknown>,
      )
    } else {
      this.chapter_id = commonFunction.generateID()
    }
  }
  chapter_id: string = ''
  subject_id: string = ''
  name: string = ''
}

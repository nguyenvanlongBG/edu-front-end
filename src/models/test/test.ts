import { BaseEntity } from '../base/base-entity'
import commonFunction from '@/components/core/commons/CommonFunction'
import type { ITest } from './i-test'

export class Test extends BaseEntity {
  constructor(test?: ITest) {
    super()
    commonFunction.assignProperties(
      this as Record<string, unknown>,
      test as unknown as Record<string, unknown>,
    )
  }
  test_id: string = ''
  name: string = ''
  start_time?: Date = new Date()
  duration: number = 90
  finish_time?: Date = new Date()
}

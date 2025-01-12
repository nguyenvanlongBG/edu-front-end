import type { IBaseEntity } from '../base/i-base-entity'

export interface ITest extends IBaseEntity {
  test_id?: string
  name?: string
  start_time?: Date
  duration?: number
  finish_time?: Date
  user_id?: string
}

import { ModelState } from '@core/enums/model-state'
import type { IBaseEntity } from './i-base-entity'

export class BaseEntity implements IBaseEntity {
  constructor(entity?: IBaseEntity) {
    if (entity) {
    }
  }
  State: ModelState = ModelState.VIEW
}

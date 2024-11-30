export interface IBaseControl {
  id?: string
  readonly?: boolean
  label?: string
  isLoading?: boolean
  labelWidth?: string
  value?: unknown
  messageWarning?: string
  ruleValidate?: (value: unknown) => boolean
  validate?: (value: unknown) => boolean
  validateCustom?: (value: unknown) => boolean
}

<template>
  <div class="e-input" :class="isFocus ? 'focus-e-input' : ''">
    <input
      class="default-input"
      :value="inputValue"
      @input="updateValue"
      :placeholder="placeholder"
      @blur="blur"
      @focus="focus"
    />
  </div>
</template>
<script lang="ts">
import { ref } from 'vue'
import type { ResultValidateBase } from '../../models'
import { useI18n } from 'vue-i18n'
export default {
  name: 'EInput',
  props: {
    inputValue: {
      type: String,
      required: true,
      default: '',
    },
    qClass: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    rules: {
      type: Array,
      required: false,
      default: () => [],
    },
    preUpdateValue: {
      type: Function,
      required: false,
      default: (value: string) => {
        return value
      },
    },
  },
  emits: ['update:inputValue'],
  setup(props, ctx) {
    const value = ref('')
    const { t } = useI18n()
    const isFocus = ref(false)
    function validateRule(value: string) {
      const resultValidate = {
        isValid: true,
        message: '',
      } as ResultValidateBase
      if (props.rules && props.rules.length) {
        if (typeof props.rules[0] === 'function') {
          // Hàm validate custom
          const messagesNotValid = [] as string[]
          props.rules.forEach(rule => {
            if (typeof rule === 'function') {
              const result = rule(value)
              if (result && !result.isValid) {
                resultValidate.isValid = false
                messagesNotValid.push(result.message)
              }
            }
          })
          resultValidate.message = messagesNotValid.join('. ')
        } else if (typeof props.rules[0] === 'string') {
          // Chuỗi Regex
          for (let index = 0; index < props.rules.length; index++) {
            const rule = props.rules[index] as string
            const regex = new RegExp(rule)
            const isValid = regex.test(value)
            if (!isValid) {
              resultValidate.isValid = false
              resultValidate.message = t('common.NotValid')
              return resultValidate
            }
          }
        }
      }
      return resultValidate
    }
    function updateValue(event: Event) {
      const resultValidate = validateRule(
        (event.target as HTMLInputElement).value,
      )
      console.log(resultValidate)
      ctx.emit('update:inputValue', event.target as HTMLInputElement)
    }
    function focus() {
      isFocus.value = true
    }
    function blur() {
      isFocus.value = false
    }
    return {
      value,
      validateRule,
      updateValue,
      isFocus,
      blur,
      focus,
    }
  },
}
</script>
<style src="../../css/e-control.scss" lang="scss"></style>

<template src="./e-input.html"></template>
<script lang="ts">
import { ref, watch } from 'vue'
// import { useI18n } from 'vue-i18n'
import { InputControl } from '@core/models/input/input-control'
export default {
  name: 'EInput',
  props: {
    control: {
      type: InputControl,
      required: true,
    },
    modelValue: {
      type: String, // Kiểu dữ liệu của modelValue
      required: true,
    },
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  watch: {
    // modelValue: {
    //   handler(newValue: string) {
    //   },
    // },
  },
  setup(props, ctx) {
    // const { t } = useI18n()

    watch(
      () => props.modelValue,
      (newData: string) => {
        localValue.value = newData
      },
    )

    const isFocus = ref(false)
    const localValue = ref(props.modelValue)
    function updateValue(event: Event) {
      const value = (event.target as HTMLInputElement).value
      localValue.value = value
      ctx.emit('update:modelValue', value)
    }
    function onFocus() {
      isFocus.value = true
      ctx.emit('focus')
    }
    function onBlur() {
      isFocus.value = false
      ctx.emit('blur')
    }
    return {
      updateValue,
      localValue,
      isFocus,
      onFocus,
      onBlur,
    }
  },
}
</script>
<style src="./e-input.scss" lang="scss"></style>

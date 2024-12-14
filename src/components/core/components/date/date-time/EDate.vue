<template src="./e-date.html"></template>

<script lang="ts">
import type { DateControl } from '@/components/core/models/date/date-control'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'EDate',
  props: {
    control: {
      type: Object as () => DateControl,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const innerValue = ref(props.modelValue)

    const validate = () => {
      if (!props.control.validateCustom(innerValue.value)) {
        emit('update:modelValue', '') // Reset value nếu không hợp lệ
      }
    }

    const onInput = () => {
      emit('update:modelValue', innerValue.value)
    }

    // Đồng bộ innerValue khi modelValue thay đổi từ bên ngoài
    watch(
      () => props.modelValue,
      newValue => {
        innerValue.value = newValue
      },
    )

    return {
      innerValue,
      validate,
      onInput,
    }
  },
})
</script>

<style src="./e-date.scss" scoped></style>

<template src="./e-number.html"></template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { NumberControl } from '@core/models/number/number-control'

export default defineComponent({
  name: 'ENumber',
  props: {
    control: {
      type: Object as () => NumberControl,
      required: true,
    },
    modelValue: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const innerValue = ref(props.modelValue)

    const validate = () => {
      if (
        typeof props.control.validateCustom == 'function' &&
        !props.control.validateCustom(innerValue.value)
      ) {
        emit('update:modelValue', null) // Reset value nếu không hợp lệ
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

<style src="./e-number.scss" scoped></style>

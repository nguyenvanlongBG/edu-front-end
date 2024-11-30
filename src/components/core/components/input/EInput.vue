<template>
  <div
    :class="[
      'e-input p-l-4px',
      control.styleClass,
      isFocus ? 'focus-e-input' : '',
    ]"
  >
    <input
      class="default-input"
      :value="modelValue"
      @input="updateValue"
      :placeholder="control.placeholder"
      @blur="blur"
      @focus="focus"
    />
  </div>
</template>
<script lang="ts">
import { ref } from 'vue'
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
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const value = ref('')
    // const { t } = useI18n()
    const isFocus = ref(false)
    function updateValue(event: Event) {
      ctx.emit('update:modelValue', (event.target as HTMLInputElement).value)
    }
    function focus() {
      isFocus.value = true
    }
    function blur() {
      isFocus.value = false
    }
    return {
      value,
      updateValue,
      isFocus,
      blur,
      focus,
    }
  },
}
</script>
<style src="./e-input.scss" lang="scss"></style>

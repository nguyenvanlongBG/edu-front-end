<template src="./e-checkbox.html"></template>
<script lang="ts">
import { defineComponent } from 'vue'
import { CheckboxControl } from '@core/models/checkbox/checkbox-control'

export default defineComponent({
  props: {
    control: {
      type: Object as () => CheckboxControl,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    function handleChange(event: Event) {
      // Chỉ phát sự kiện nếu không ở chế độ readonly
      if (!props.control.readonly) {
        const input = event.target as HTMLInputElement
        emit('change', input.checked)
      }
    }

    return { handleChange }
  },
})
</script>

<style src="./e-checkbox.scss" scoped></style>

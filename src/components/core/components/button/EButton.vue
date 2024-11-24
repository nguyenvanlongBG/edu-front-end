<!-- Button.vue -->
<template src="./e-button.html"></template>
<style src="./e-button.scss" scoped></style>

<script lang="ts">
import { defineComponent } from 'vue'
import { ButtonControl } from '@core/models/button/button-control'

export default defineComponent({
  props: {
    control: {
      type: Object as () => ButtonControl,
      required: true,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    function handleClick(event: Event) {
      if (!props.control.readonly && !props.control.isLoading) {
        emit('click', event)
      }
    }

    return { handleClick }
  },
})
</script>

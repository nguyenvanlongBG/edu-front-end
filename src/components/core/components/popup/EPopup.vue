<template src="./e-popup.html"></template>
<script lang="ts">
import { defineComponent } from 'vue'
import { PopupControl } from '../../models/popup/popup-control'
import EButton from '../button/EButton.vue'

export default defineComponent({
  components: {
    EButton,
  },
  props: {
    control: {
      type: PopupControl,
      required: true,
    },
  },
  emits: ['change', 'close'],
  setup(props, { emit }) {
    function handleChange(event: Event) {
      // Chỉ phát sự kiện nếu không ở chế độ readonly
      if (!props.control.readonly) {
        const input = event.target as HTMLInputElement
        emit('change', input.checked)
      }
    }
    function closePopup() {
      emit('close')
    }
    return { handleChange, closePopup }
  },
})
</script>

<style src="./e-popup.scss" scoped></style>

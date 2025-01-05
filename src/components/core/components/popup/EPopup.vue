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
  setup(props) {
    function closePopup() {
      const control = props.control
      if (control && typeof control.handleEmit == 'function') {
        control.handleEmit('close')
      }
    }
    return { closePopup }
  },
})
</script>

<style src="./e-popup.scss" scoped></style>

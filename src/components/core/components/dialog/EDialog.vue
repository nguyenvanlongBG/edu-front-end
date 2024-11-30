<template src="./e-popup.html"></template>
<script lang="ts">
import { defineComponent } from 'vue'
import EButton from '../button/EButton.vue'
import { DialogControl } from '../../models/dialog/dialog-control'
import EPopup from '../popup/EPopup.vue'
import type { ButtonControl } from '../../models/button/button-control'

export default defineComponent({
  components: {
    EPopup,
    EButton,
  },
  props: {
    control: {
      type: DialogControl,
      required: true,
    },
  },
  emits: ['change'],
  setup() {
    function onBtnClick(btn: ButtonControl) {
      if (btn) {
      }
    }

    return { onBtnClick }
  },
})
</script>

<style src="./e-popup.scss" scoped></style>

<template src="./e-dialog.html"></template>
<script lang="ts">
import { defineComponent } from 'vue'
import EButton from '@core/components/button/EButton.vue'
import { DialogControl } from '@core/models/dialog/dialog-control'
import EPopup from '@core/components/popup/EPopup.vue'
import type { ButtonControl } from '@core/models/button/button-control'

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

<style src="./e-dialog.scss" scoped></style>

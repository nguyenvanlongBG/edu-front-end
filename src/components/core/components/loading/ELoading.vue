<script lang="ts">
import { LoadingControl } from '@core/models/loading/loading-control'
import { LoadingType } from '@core/enums/Common'
export default {
  name: 'ELoading',
  props: {
    control: {
      type: LoadingControl,
      required: true,
    },
    modelValue: {
      type: Boolean, // Kiểu dữ liệu của modelValue
      required: true,
    },
  },
  setup() {
    return {
      LoadingType,
    }
  },
}
</script>
<template src="./e-loading.html"></template>
<style src="./e-loading.scss" lang="scss"></style>

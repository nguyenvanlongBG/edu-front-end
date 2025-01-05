<script lang="ts">
import { ref } from 'vue'
import { TabControl } from '../../models/tab/tab-control'

export default {
  props: {
    control: {
      type: TabControl,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const control = props.control
    function selectTab(tabId: string) {
      if (control) {
        control.value = tabId
      }
      emit('change', tabId)
    }
    return {
      selectTab,
    }
  },
}
</script>
<template src="./e-tab.html"></template>
<style lang="css" src="./e-tab.scss" scoped />

<script lang="ts">
import { TableLabelControl } from '@/components/core/models/table-label/table-label-control'
import { ItemTableLabel } from '@/components/core/models/table-label/item-table-label'
export default {
  props: {
    control: {
      type: TableLabelControl,
      required: true,
    },
  },
  emits: ['selected'],
  setup(props, ctx) {
    function handleClick(item: ItemTableLabel, index: number) {
      ctx.emit('selected', item, index)
    }
    return {
      handleClick,
    }
  },
}
</script>

<template src="./e-table-label.html"></template>
<style src="./e-table-label.scss" lang="scss"></style>

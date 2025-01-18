<template src="./e-paging.html"></template>
<style src="./e-paging.scss" scoped></style>

<script lang="ts">
import { PagingControl } from '../../models/paging/paging-control'

export default {
  name: 'PagingComponent',
  props: {
    control: {
      type: PagingControl,
      required: true,
    },
  },
  emits: ['page-change'],
  setup(props, { emit }) {
    function goToPage(page: number) {
      if (page >= 1 && page <= props.control.totalPage) {
        emit('page-change', page)
      }
    }
    return {
      goToPage,
    }
  },
}
</script>

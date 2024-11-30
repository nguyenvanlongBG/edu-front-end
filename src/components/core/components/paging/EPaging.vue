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
  methods: {
    goToPage(page: number) {
      if (page >= 1 && page <= this.control.totalPage) {
        this.$emit('page-changed', page)
      }
    },
  },
}
</script>

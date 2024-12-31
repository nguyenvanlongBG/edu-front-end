<script lang="ts">
import ETable from '@/components/core/components/table/ETable.vue'
import { ColumnControl } from '@/components/core/models/table/column/column-control'
import { TableControl } from '@/components/core/models/table/table-control'
import { ColumnType } from '@/enums/enumeration'
import { ref } from 'vue'

export default {
  components: {
    ETable,
  },
  setup() {
    const tableControl = ref(
      new TableControl({
        columns: [
          new ColumnControl({
            name: 'Tên học sinh',
            valueKey: 'name',
          }),
          new ColumnControl({
            name: 'Điểm',
            valueKey: 'size',
          }),
          new ColumnControl({
            name: 'Chức năng',
            valueKey: 'size',
            type: ColumnType.Action,
          }),
        ],
        data: [
          {
            name: 'Shirt',
            size: 'Small, Medium',
            price: 14.99,
            discount: 14.99,
          },
        ],
      }),
    )
    return {
      tableControl,
    }
  },
}
</script>
<template src="./mark-list-test.html"></template>
<style src="./mark-list-test.scss" lang="scss" />

<script lang="ts">
import { ColumnType } from '@/enums/enumeration'
import { TableControl } from '../../models/table/table-control'
import { computed, type CSSProperties } from 'vue'
import EButton from '../button/EButton.vue'
import type { ColumnControl } from '../../models/table/column/column-control'

export default {
  components: {
    EButton,
  },
  props: {
    control: {
      type: TableControl,
      required: true,
    },
  },
  setup(props) {
    const dataColumn = computed(() => {
      return props.control.columns.filter(
        column => column.type == ColumnType.TextBox,
      )
    })
    const actionColumn = computed(() => {
      return props.control.columns.find(
        column => column.type === ColumnType.Action,
      )
    })
    const getColumnStyle = (column: ColumnControl) => {
      const styles: CSSProperties = {}

      // Nếu có width, ưu tiên sử dụng width
      if (column.width) {
        styles.width = column.width
      }

      // Nếu không có width, dùng flex
      if (!column.width && column.flex) {
        styles.flex = column.flex
        styles.display = 'flex'
      }

      // Trả về các kiểu được tính toán
      return styles
    }
    return {
      getColumnStyle,
      dataColumn,
      actionColumn,
    }
  },
}
</script>
<template src="./e-table.html"></template>
<style lang="scss" src="./e-table.scss" />

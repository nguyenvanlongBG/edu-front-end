<script lang="ts">
import { ColumnType } from '@/enums/enumeration'
import { TableControl } from '../../models/table/table-control'

export default {
  props: {
    control: {
      type: TableControl,
      required: true,
    },
  },
  setup(props) {
    function dataColumn() {
      return props.control.columns.filter(
        column => column.type == ColumnType.TextBox,
      )
    }
    function actionColumn() {
      return props.control.columns.find(
        column => column.type == ColumnType.Action,
      )
    }
    return {
      dataColumn,
      actionColumn,
    }
  },
}
</script>
<template src="./e-table.html"></template>
<style lang="scss" src="./e-table.scss" />

<template src="./e-combobox.html"></template>

<script lang="ts">
import { reactive, ref } from 'vue'
import { ComboboxControl } from '../../models/combobox/combobox-control'

export default {
  name: 'ECombobox',
  props: {
    control: {
      type: ComboboxControl,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  watch: {
    'control.bindingText'(newValue) {
      this.inputValue = newValue
    },
  },

  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const options = ref(props.control.data as Array<Record<string, unknown>>)
    const inputValue = ref<string>(props.control.bindingText ?? '')
    const internalValue = ref(props.modelValue)
    const isFirstLoad = ref(true)
    const controlInternal = reactive<ComboboxControl>(props.control)
    function onShowOptions() {
      if (controlInternal.isOpenSelextBox) {
        controlInternal.isOpenSelextBox = false
      } else {
        controlInternal.isOpenSelextBox = true
      }
    }
    function selectItem(item: Record<string, unknown>) {
      inputValue.value = item[props.control.displayField] as string
      controlInternal.isOpenSelextBox = false
      emit('update:modelValue', item[props.control.valueField])
    }
    return {
      options,
      controlInternal,
      isFirstLoad,
      inputValue,
      internalValue,
      onShowOptions,
      selectItem,
    }
  },
  created() {
    this.options = this.control.data
  },
}
</script>

<style src="./e-combobox.scss" scoped></style>

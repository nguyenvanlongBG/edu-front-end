<script lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  defineComponent,
  type PropType,
} from 'vue'
import { MultiComboboxControl } from '@core/models/multi-combobox/multi-combobox-control'

export default defineComponent({
  name: 'MultiSelect',
  props: {
    control: {
      type: MultiComboboxControl,
      required: true,
    },
    modelValue: {
      type: Array as PropType<unknown[]>, // Mảng chứa giá trị của các phần tử đã chọn
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const search = ref<string>('')
    const isFocused = ref<boolean>(false)
    const selectedItemIndex = ref<number>(-1)
    const selectedOptionIndex = ref<number>(-1)
    const searchWidth = ref<number>(4)
    const controlWidth = ref<number>(100)
    const controlRef = ref<HTMLElement | null>(null)
    const ghostRef = ref<HTMLElement | null>(null)
    const listRef = ref<HTMLElement | null>(null)

    const selectedItems = computed(() => {
      if (!props.control.data) return []
      return props.modelValue.map(value =>
        props.control.data.find(
          option => option[props.control.valueField] === value,
        ),
      )
    })

    const availableOptions = computed(() => {
      if (!props.control.data) return []
      const searchText = search.value.toLowerCase().trim()
      return props.control.data.filter(option => {
        return (
          !selectedItems.value.includes(option) &&
          (!searchText ||
            String(option[props.control.displayField])
              .toLowerCase()
              .includes(searchText))
        )
      })
    })

    const ghostValue = computed<string>(() => {
      return search.value.replace(/\s/g, '&nbsp;')
    })

    const searchStyle = computed<Record<string, string>>(() => {
      return {
        width: `${searchWidth.value + 4}px`,
        maxWidth: `${controlWidth.value - 14}px`,
      }
    })

    const showDropdown = computed<boolean>(() => {
      return (
        isFocused.value &&
        (availableOptions.value.length > 0 || search.value.length > 0)
      )
    })

    const showPlaceholder = computed<boolean>(() => {
      return !search.value.trim() && selectedItems.value.length === 0
    })

    const toggleOption = (option: Record<string, unknown>) => {
      const newValue = [...props.modelValue]
      const optionValue = option[props.control.valueField] as unknown

      const valueIndex = newValue.findIndex(val => val === optionValue)
      if (valueIndex === -1) {
        newValue.push(optionValue)
      } else {
        newValue.splice(valueIndex, 1)
      }
      emit('update:modelValue', newValue)
    }

    const updateSearchDimensions = () => {
      nextTick(() => {
        if (ghostRef.value) searchWidth.value = ghostRef.value.offsetWidth
        if (controlRef.value) controlWidth.value = controlRef.value.offsetWidth
      })
    }

    watch(search, updateSearchDimensions)
    watch(isFocused, isFocusedValue => {
      if (isFocusedValue) {
        nextTick(() => {
          if (listRef.value) listRef.value.scrollTop = 0
          selectedOptionIndex.value = 0
        })
      } else {
        selectedItemIndex.value = -1
        selectedOptionIndex.value = -1
      }
    })

    const onControlClick = () => {
      focusSearch()
    }

    const focusSearch = () => {
      if (controlRef.value) {
        const input = controlRef.value.querySelector('input')
        if (input) input.focus()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const availableOptionCount = availableOptions.value.length

      if (event.key === 'Escape') {
        isFocused.value = false
        return
      }

      if (event.key === 'ArrowDown' && availableOptionCount > 0) {
        if (selectedOptionIndex.value < availableOptionCount - 1) {
          selectedOptionIndex.value++
        }
      }

      if (event.key === 'ArrowUp' && availableOptionCount > 0) {
        if (selectedOptionIndex.value > 0) {
          selectedOptionIndex.value--
        }
      }

      if (event.key === 'Enter' && selectedOptionIndex.value >= 0) {
        toggleOption(availableOptions.value[selectedOptionIndex.value])
        search.value = ''
      }
      // Xử lý sự kiện Delete hoặc Backspace
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const newValue = [...props.modelValue]
        if (newValue?.length) {
          newValue.splice(newValue?.length - 1, 1) // Xóa phần tử
          emit('update:modelValue', newValue) // Cập nhật giá trị
        }
      }
    }
    function onClickItemSelected(item: Record<string, unknown>) {
      const newValue = [...props.modelValue]

      if (item) {
        const valueIndex = newValue.findIndex(
          val => val === item[props.control.valueField],
        )
        if (valueIndex !== -1) {
          newValue.splice(valueIndex, 1) // Xóa phần tử
          emit('update:modelValue', newValue) // Cập nhật giá trị
        }
      }
    }
    return {
      search,
      isFocused,
      selectedItemIndex,
      onClickItemSelected,
      selectedOptionIndex,
      selectedItems,
      availableOptions,
      ghostValue,
      searchStyle,
      showDropdown,
      showPlaceholder,
      toggleOption,
      onControlClick,
      focusSearch,
      controlRef,
      ghostRef,
      listRef,
      handleKeyDown,
    }
  },
})
</script>
<template src="./e-multi-combobox.html"></template>
<style lang="scss" src="./e-multi-combobox.scss" />

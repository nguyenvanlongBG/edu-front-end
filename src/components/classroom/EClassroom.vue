<template src="./e-classroom.html"></template>
<style src="./e-classroom.scss" scoped></style>

<script lang="ts">
import { reactive, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'ClassroomComponent',
  setup() {
    const state = reactive({
      displayNavClassroom: false,
    })

    const toggleActionClassroom = () => {
      state.displayNavClassroom = !state.displayNavClassroom
    }

    const closeMenu = () => {
      state.displayNavClassroom = false
    }

    onMounted(() => {
      window.addEventListener('click', closeMenu)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('click', closeMenu)
    })

    return {
      state,
      toggleActionClassroom,
    }
  },
}
</script>

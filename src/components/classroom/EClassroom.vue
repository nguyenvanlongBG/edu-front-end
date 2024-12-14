<template src="./e-classroom.html"></template>
<style src="./e-classroom.scss" scoped></style>

<script lang="ts">
import { Classroom } from '@/models/classroom/classroom'
import { reactive, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'EClassroom',
  props: {
    classroom: {
      type: Classroom,
    },
  },

  setup(props) {
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

    function avatarClass() {
      if (props.classroom && props.classroom.avatar) {
        return props.classroom.avatar
      }
      return new URL('@core/assets/pictures/classroom.png', import.meta.url)
        .href
    }

    return {
      state,
      toggleActionClassroom,
      avatarClass,
    }
  },
}
</script>

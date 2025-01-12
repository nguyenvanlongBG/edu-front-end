<template src="./e-classroom.html"></template>
<style src="./e-classroom.scss" scoped></style>

<script lang="ts">
import { Classroom } from '@/models/classroom/classroom'
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import localStorageLibrary from '../core/commons/LocalStorageLibrary'
import type { User } from '@/models/user/user'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { Role } from '@/enums/role'

export default {
  name: 'EClassroom',
  props: {
    classroom: {
      type: Classroom,
    },
  },
  emits: ['edit', 'leave'],
  setup(props, { emit }) {
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
    function isShowEdit() {
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (user && user.user_id) {
        if (user) {
          if (user.role_id == Role.Admin) return true
          if (
            user.role_id == Role.Teacher &&
            user.user_id == props.classroom?.user_id
          )
            return true
        }
      }
      return false
    }
    function avatarClass() {
      if (props.classroom && props.classroom.avatar) {
        return props.classroom.avatar
      }
      return new URL('@core/assets/pictures/classroom.png', import.meta.url)
        .href
    }
    function onEdit() {
      emit('edit', props.classroom)
    }
    function onEnroll() {
      emit('enroll', props.classroom)
    }
    function onLeave() {
      emit('leave', props.classroom)
    }
    return {
      state,
      isShowEdit,
      toggleActionClassroom,
      avatarClass,
      onEdit,
      onEnroll,
      onLeave,
    }
  },
}
</script>

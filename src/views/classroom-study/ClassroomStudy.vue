<script lang="ts">
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import { FilterOperator } from '@/components/core/enums/Common'
import { FilterCondition } from '@/components/core/models/paging/filter-condition'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { EnrollmentStatus } from '@/enums/classroom'
import { Role } from '@/enums/role'
import type { EnrollmentClass } from '@/models/enrollment-class/enrollment-class'
import { User } from '@/models/user/user'
import EnrollmentClassService from '@/services/enrollment-class-service'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const isShowListStudent = ref(false)
    const isShowListRequest = ref(false)
    const isShowBoxRequest = ref(false)
    const route = useRoute()
    const classroom_id = route.params.classroom_id as string
    const enrolls = ref([] as EnrollmentClass[])
    const enrollSuccess = computed(() => {
      return enrolls.value.filter(e => e.status == EnrollmentStatus.ACCEPT)
    })
    const enrollPending = computed(() => {
      return enrolls.value.filter(e => e.status == EnrollmentStatus.PENDING)
    })
    function onToggleUser() {
      if (isShowListStudent.value) {
        isShowListStudent.value = false
      } else {
        isShowListStudent.value = true
      }
    }
    function onToggleRequest() {
      if (isShowListStudent.value) {
        isShowListRequest.value = false
      } else {
        isShowListRequest.value = true
      }
    }
    async function handleLoadData() {
      await handleLoadPostOfClass()
      await handleLoadEnroll()
    }
    async function handleLoadPostOfClass() {}
    async function handleLoadEnroll() {
      const enrollService = new EnrollmentClassService()
      const result = await enrollService.enrollsOfClass(classroom_id)
      enrolls.value = result as unknown as EnrollmentClass[]
    }
    function buildFilterEnroll() {
      return [
        new FilterCondition({
          Field: 'classroom_id',
          Operator: FilterOperator.Equal,
          Value: classroom_id,
        }),
      ]
    }
    function initData() {
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (
        user &&
        (user.role_id == Role.Admin || user?.role_id == Role.Teacher)
      ) {
        isShowBoxRequest.value = true
      } else {
        isShowBoxRequest.value = false
      }
    }
    return {
      onToggleUser,
      onToggleRequest,
      isShowBoxRequest,
      isShowListRequest,
      enrolls,
      buildFilterEnroll,
      enrollPending,
      enrollSuccess,
      classroom_id,
      isShowListStudent,
      handleLoadData,
      handleLoadPostOfClass,
      handleLoadEnroll,
      initData,
    }
  },
  created() {
    this.initData()
  },
  async mounted() {
    await this.handleLoadData()
  },
}
</script>
<template src="./classroom-study.html"></template>
<style src="./classroom-study.scss" lang="scss" />

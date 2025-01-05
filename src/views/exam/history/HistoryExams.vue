<script lang="ts">
import ETab from '@/components/core/components/tab/ETab.vue'
import { TabControl } from '@/components/core/models/tab/tab-control'
import { TabItemControl } from '@/components/core/models/tab/tab-item/tab-item-control'
import { ExamDto } from '@/models/exam/Dto/exam-dto'
import TestService from '@/services/test-service'
import { nextTick, ref } from 'vue'
import { useRoute } from 'vue-router'
import ExamDetail from '../ExamDetail.vue'
import { ExamMode } from '@/enums/exam'
import { LoadingType } from '@/components/core/enums/Common'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import ELoading from '@/components/core/components/loading/ELoading.vue'

export default {
  components: {
    ETab,
    ExamDetail,
    ELoading,
  },
  setup() {
    const tabControl = ref(
      new TabControl({
        tabs: [
          new TabItemControl({
            id: '1',
            name: 'Lần 1',
          }),
          new TabItemControl({
            id: '2',
            name: 'Lần 2',
          }),
        ],
      }),
    )
    const testId = ref('')
    const isLoading = ref(false)
    const loadingControl = ref(
      new LoadingControl({
        type: LoadingType.LoadingNormal,
      }),
    )
    const masterData = ref(new ExamDto())
    async function initControl() {
      const route = useRoute()
      testId.value = route.params.test_id as string
      if (testId.value) {
        const testService = new TestService()
        const exams = (await testService.examsUserHistory(
          testId.value,
        )) as unknown as ExamDto[]
        if (exams && exams.length) {
          tabControl.value.tabs = exams.map(
            (e, index) =>
              new TabItemControl({
                id: e.exam_id,
                name: 'Lần' + (index + 1),
              }),
          ) as unknown as TabItemControl[]
          tabControl.value.value = exams[0].exam_id
        }
      }
    }
    async function initData() {
      if (tabControl.value.value) {
        masterData.value.exam_id = tabControl.value.value as string
        masterData.value.mode = ExamMode.History
      }
    }
    async function onChangeExam(examId: string) {
      isLoading.value = true
      nextTick(() => {
        masterData.value.exam_id = examId
        masterData.value.mode = ExamMode.History
        isLoading.value = false
      })
    }
    return {
      tabControl,
      testId,
      masterData,
      initControl,
      initData,
      isLoading,
      loadingControl,
      onChangeExam,
    }
  },
  async mounted() {
    this.isLoading = true
    await this.initControl()
    this.initData()
    this.isLoading = false
  },
}
</script>
<template src="./history-exams.html"></template>
<style lang="css" src="./history-exams.scss" />

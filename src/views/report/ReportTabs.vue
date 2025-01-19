<script lang="ts">
import ETab from '@/components/core/components/tab/ETab.vue'
import { TabControl } from '@/components/core/models/tab/tab-control'
import { nextTick, ref } from 'vue'
import { LoadingType } from '@/components/core/enums/Common'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import ELoading from '@/components/core/components/loading/ELoading.vue'
import ReportTest from './report-test/ReportTest.vue'
import ReportLevel from './report-level/ReportLevel.vue'
import ReportChapter from './report-chapter/ReportChapter.vue'
import { TabItemControl } from '@/components/core/models/tab/tab-item/tab-item-control'

export default {
  components: {
    ETab,
    ReportTest,
    ReportLevel,
    ReportChapter,
    ELoading,
  },
  setup() {
    const tabControl = ref(
      new TabControl({
        tabs: [
          new TabItemControl({
            id: '1',
            name: 'Đề thi',
          }),
          new TabItemControl({
            id: '2',
            name: 'Chương',
          }),
          new TabItemControl({
            id: '3',
            name: 'Mức độ',
          }),
        ],
      }),
    )
    const isLoading = ref(false)
    const loadingControl = ref(
      new LoadingControl({
        type: LoadingType.LoadingNormal,
      }),
    )
    async function initControl() {
      tabControl.value.value = '1'
    }
    async function initData() {
      if (tabControl.value.value) {
      }
    }
    async function onChangeTab(tabId: string) {
      isLoading.value = true
      nextTick(() => {
        isLoading.value = false
      })
    }
    return {
      tabControl,
      initControl,
      initData,
      isLoading,
      loadingControl,
      onChangeTab,
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
<template src="./report-tabs.html"></template>
<style lang="css" src="./report-tabs.scss" />

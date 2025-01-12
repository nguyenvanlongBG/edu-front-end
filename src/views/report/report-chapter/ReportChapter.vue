<script lang="ts">
import { MultiComboboxControl } from '@/components/core/models/multi-combobox/multi-combobox-control'
import { ReportParam } from '@/models/report/report-param'
import TestService from '@/services/test-service'
import { ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import ReportService from '@/services/report-service'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import type { User } from '@/models/user/user'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { Role } from '@/enums/role'
import EMultiCombobox from '@/components/core/components/e-multi-combobox/EMultiCombobox.vue'

export default {
  components: {
    apexchart: ApexCharts,
    EMultiCombobox,
  },
  setup() {
    const series = ref([
      {
        name: 'Đúng',
        data: [] as number[],
      },
      {
        name: 'Sai',
        data: [] as number[],
      },
      {
        name: 'Chưa làm',
        data: [] as number[],
      },
    ])
    const chartOptions = ref({
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        categories: [] as string[],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'right',
        offsetX: 0,
        offsetY: 50,
      },
    })
    const testIds = ref([] as string[])
    const testCbb = ref(
      new MultiComboboxControl({
        displayField: 'name',
        valueField: 'test_id',
        data: [],
      }),
    )
    const classIds = ref([] as string[])
    const classCbb = ref(
      new MultiComboboxControl({
        displayField: 'name',
        valueField: 'class_id',
        data: [],
      }),
    )
    const isShowRoleTeacher = ref(true)
    async function handleLoadData() {
      await getTestOfUser()
      await handleLoadReport()
    }
    async function handleLoadReport() {
      const reportService = new ReportService()
      const reportParam = buildReportParam()
      const result = await reportService.reportChapter(
        reportParam as unknown as Record<string, unknown>,
      )
      const recordsReport = result as unknown as Array<Record<string, unknown>>
      handleLoadChart(recordsReport)
    }
    function handleLoadChart(data: Array<Record<string, unknown>>) {
      // Kiểm tra nếu không có dữ liệu
      chartOptions.value.xaxis.categories.splice(
        0,
        chartOptions.value.xaxis.categories.length,
      ) // Xóa toàn bộ phần tử
      series.value.forEach(s => {
        s.data.splice(0, series.value.length)
      })
      // Chuẩn bị dữ liệu cho series và categories
      const correctData: number[] = []
      const incorrectData: number[] = []
      const unattemptedData: number[] = []

      data.forEach(item => {
        const chapterName = item.chapter_name as string // Lấy tên chương
        const correct = item.correct as number // Số câu đúng
        const incorrect = item.incorrect as number // Số câu sai
        const unattempted = item.unattempted as number // Số câu chưa làm

        chartOptions.value.xaxis.categories.push(chapterName)
        correctData.push(correct)
        incorrectData.push(incorrect)
        unattemptedData.push(unattempted)
      })
      const correctSeri = series.value.find(s => s.name == 'Đúng')
      const incorrectSeri = series.value.find(s => s.name == 'Sai')
      const unattemptedSeri = series.value.find(s => s.name == 'Chưa làm')
      if (correctSeri) {
        correctData.forEach(c => correctSeri.data.push(c))
      }
      if (incorrectSeri) {
        incorrectData.forEach(c => incorrectSeri.data.push(c))
      }
      if (unattemptedSeri) {
        unattemptedData.forEach(c => unattemptedSeri.data.push(c))
      }
    }
    async function getTestOfUser() {
      const testService = new TestService()
      const tests = await testService.getAllTestOfUser()
      testCbb.value.data = tests as unknown as Array<Record<string, unknown>>
    }
    function buildReportParam() {
      const reportParam = new ReportParam()
      if (testIds.value && testIds.value.length) {
        reportParam.testIds = testIds.value
      }
      return reportParam
    }
    function initData() {
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (user) {
        isShowRoleTeacher.value =
          user.role_id == Role.Admin || user.role_id == Role.Teacher
      }
    }
    return {
      initData,
      testIds,
      testCbb,
      classCbb,
      classIds,
      isShowRoleTeacher,
      series,
      buildReportParam,
      chartOptions,
      handleLoadData,
      handleLoadReport,
      handleLoadChart,
      getTestOfUser,
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
<template src="./report-chapter.html"></template>
<style src="./report-chapter.scss" />

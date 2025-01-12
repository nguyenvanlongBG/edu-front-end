<script lang="ts">
import { MultiComboboxControl } from '@/components/core/models/multi-combobox/multi-combobox-control'
import { ReportParam } from '@/models/report/report-param'
import TestService from '@/services/test-service'
import { ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'

export default {
  components: {
    apexchart: ApexCharts,
  },
  setup() {
    const testIds = ref([] as string[])
    const series = ref([
      {
        name: 'PRODUCT A',
        data: [44, 55, 41, 67, 22, 43, 21, 49],
      },
      {
        name: 'PRODUCT B',
        data: [13, 23, 20, 8, 13, 27, 33, 12],
      },
      {
        name: 'PRODUCT C',
        data: [11, 17, 15, 15, 21, 14, 15, 13],
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
        categories: [
          '2011 Q1',
          '2011 Q2',
          '2011 Q3',
          '2011 Q4',
          '2012 Q1',
          '2012 Q2',
          '2012 Q3',
          '2012 Q4',
        ],
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
    const testCbb = ref(
      new MultiComboboxControl({
        displayField: 'name',
        valueField: 'test_id',
        data: [],
      }),
    )
    async function handleLoadData() {
      await getTestOfUser()
      await handleLoadReport()
    }
    async function handleLoadReport() {}
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
    return {
      testIds,
      series,
      buildReportParam,
      chartOptions,
      handleLoadData,
      handleLoadReport,
      getTestOfUser,
    }
  },
  mounted() {},
}
</script>
<template src="./report-level.html"></template>
<style src="./report-level.scss" />

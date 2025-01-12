<script lang="ts">
import { ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import ReportService from '@/services/report-service'
import ETable from '@/components/core/components/table/ETable.vue'
import { TableControl } from '@/components/core/models/table/table-control'
import { ColumnControl } from '@/components/core/models/table/column/column-control'
import { Role } from '@/enums/role'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { User } from '@/models/user/user'
import EMultiCombobox from '@/components/core/components/e-multi-combobox/EMultiCombobox.vue'
import { MultiComboboxControl } from '@/components/core/models/multi-combobox/multi-combobox-control'
import { ReportParam } from '@/models/report/report-param'
import TestService from '@/services/test-service'
import ClassroomService from '@/services/classroom-service'

export default {
  components: {
    apexchart: ApexCharts,
    ETable,
    EMultiCombobox,
  },
  setup() {
    const tableControl = ref(
      new TableControl({
        columns: [
          new ColumnControl({
            name: 'Tên học sinh',
            valueKey: 'name',
            flex: 8,
          }),
          new ColumnControl({
            name: 'Đề 1',
            valueKey: '123',
            flex: 2,
          }),
        ],
        data: [
          {
            name: 'Nguyễn Văn A',
            '123': '9',
            price: 14.99,
            discount: 14.99,
          },
        ],
      }),
    )
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
    const series = ref([
      {
        name: 'SL',
        data: [] as number[],
      },
    ])
    const chartOptions = ref({
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
      },

      xaxis: {
        categories: [] as string[],
        position: 'bottom',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val: number) {
            return val
          },
        },
      },
      title: {
        text: 'Phổ điểm',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444',
        },
      },
    })
    const isShowRoleTeacher = ref(true)
    async function handleLoadData() {
      await getTestOfUser()
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (
        user &&
        (user.role_id == Role.Admin || user?.role_id == Role.Teacher)
      ) {
        await getClassroomOfTeacher()
      }
      await handleLoadReport()
    }
    function buildReportParam() {
      const reportParam = new ReportParam()
      if (testIds.value && testIds.value.length) {
        reportParam.testIds = testIds.value
      }
      if (classIds.value && classIds.value.length) {
        reportParam.classIds = classIds.value
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
    async function getTestOfUser() {
      const testService = new TestService()
      const tests = await testService.getAllTestOfUser()
      testCbb.value.data = tests as unknown as Array<Record<string, unknown>>
    }
    async function getClassroomOfTeacher() {
      const classroomService = new ClassroomService()
      const classrooms = await classroomService.getAllClassOfUser()
      classCbb.value.data = classrooms as unknown as Array<
        Record<string, unknown>
      >
    }
    async function handleLoadReport() {
      const reportService = new ReportService()
      let tests = testCbb.value.data
      if (testIds.value?.length) {
        tests = tests?.filter(
          test =>
            'test_id' in test && testIds.value.includes(test.test_id as string),
        )
      }
      tableControl.value.columns = [
        new ColumnControl({
          name: 'Tên học sinh',
          valueKey: 'name',
          flex: 1,
        }),
      ]
      tests.forEach(test => {
        tableControl.value.columns.push(
          new ColumnControl({
            name: test.name as string,
            valueKey: test.test_id as string,
            width: '80px',
          }),
        )
      })
      const reportParam = buildReportParam()
      const result = await reportService.reportTest(
        reportParam as unknown as Record<string, unknown>,
      )
      const recordsReport = result as unknown as Array<Record<string, unknown>>
      tableControl.value.data = recordsReport
      handleDataSummary(recordsReport)
    }
    function handleDataSummary(data: Array<Record<string, unknown>>) {
      const result: Record<number, number> = {} // Phổ điểm (score -> frequency)
      if (data?.length) {
        data.forEach(student => {
          Object.keys(student).forEach(key => {
            if (key?.length == 36) {
              const scores = student[key] as number[] // Lấy danh sách điểm
              scores.forEach(score => {
                result[score] = (result[score] || 0) + 1 // Đếm số lần xuất hiện
              })
            }
          })
        })
      }
      const scores = Object.keys(result).map(String) // Chuyển đổi khóa từ string sang number
      const counts = Object.values(result) // Lấy số lần xuất hiện

      series.value[0].data = counts // Gán số lần xuất hiện cho trục Y
      chartOptions.value.xaxis.categories.splice(
        0,
        chartOptions.value.xaxis.categories.length,
      ) // Xóa toàn bộ phần tử
      scores?.forEach(score => {
        chartOptions.value.xaxis.categories.push(score) // Gán danh sách điểm cho trục X
      })
    }
    async function onUpdateTestIds(ids: string[]) {
      testIds.value = ids
      setTimeout(async () => {
        await handleLoadReport() // Gọi vào hàm load dữ liệu với danh sách test ID
      }, 500)
    }
    async function onUpdateClassIds(ids: string[]) {
      testIds.value = ids
      setTimeout(async () => {
        await handleLoadReport() // Gọi vào hàm load dữ liệu với danh sách test ID
      }, 500)
    }
    return {
      onUpdateTestIds,
      onUpdateClassIds,
      handleLoadReport,
      getClassroomOfTeacher,
      testCbb,
      testIds,
      classCbb,
      classIds,
      isShowRoleTeacher,
      handleDataSummary,
      buildReportParam,
      chartOptions,
      tableControl,
      series,
      handleLoadData,
      initData,
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

<template src="./report-test.html"></template>
<style src="./report-test.scss" lang="scss" />

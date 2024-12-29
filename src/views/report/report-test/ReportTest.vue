<script lang="ts">
import { ref } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import ReportService from '@/services/report-service'

export default {
  components: {
    apexchart: ApexCharts,
  },
  setup() {
    const series = ref([
      {
        name: 'Bài thi',
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
        position: 'top',
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
    async function loadData() {
      const reportService = new ReportService()
      const result = await reportService.reportTest()
      // Chuyển đổi dữ liệu cho biểu đồ
      const scores = Object.keys(result) // Chuyển đổi khóa từ string sang number
      const counts = Object.values(result) // Lấy các giá trị (số lượng bài thi cho mỗi điểm)
      series.value[0].data = counts
      scores.forEach(score => {
        chartOptions.value.xaxis.categories.push(score)
      })
    }
    return {
      chartOptions,
      series,
      loadData,
    }
  },
  mounted() {
    this.loadData()
  },
}
</script>

<template src="./report-test.html"></template>
<style src="./report-test.scss" lang="scss" />

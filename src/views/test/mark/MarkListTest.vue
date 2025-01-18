<script lang="ts">
import EButton from '@/components/core/components/button/EButton.vue'
import ETable from '@/components/core/components/table/ETable.vue'
import { LoadingType } from '@/components/core/enums/Common'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import { ColumnControl } from '@/components/core/models/table/column/column-control'
import { TableControl } from '@/components/core/models/table/table-control'
import { ColumnType } from '@/enums/enumeration'
import { ExamStatus } from '@/enums/exam'
import type { ExamDto } from '@/models/exam/Dto/exam-dto'
import { TestDto } from '@/models/test/test-dto'
import ExamService from '@/services/exam-service'
import TestService from '@/services/test-service'
import { ref } from 'vue'

export default {
  components: {
    ETable,
    EButton,
  },
  props: {
    test: {
      type: TestDto,
      required: true,
    },
  },
  setup(props) {
    const markAllExamBtn = ref(
      new ButtonControl({
        label: 'Chấm điểm',
      }),
    )
    const tableControl = ref(
      new TableControl({
        columns: [
          new ColumnControl({
            name: 'Tên học sinh',
            valueKey: 'name',
            flex: 6,
          }),
          new ColumnControl({
            name: 'Điểm',
            valueKey: 'point',
            flex: 2,
          }),
          new ColumnControl({
            name: 'Trạng thái',
            valueKey: 'status',
            flex: 2,
            customDisplay: item => {
              if (item.status == ExamStatus.Marked) {
                return 'Đã chấm' as unknown
              } else {
                return 'Chưa chấm' as unknown
              }
            },
          }),
          new ColumnControl({
            name: 'Chức năng',
            valueKey: 'size',
            flex: 2,
            toolbarItems: [
              new ButtonControl({
                label: 'Chấm điểm',
                classType: 'outline',
                name: 'mark',
              }),
              new ButtonControl({
                label: 'Chấm lại',
                classType: 'outline',
                name: 'mark-again',
              }),
            ],
            type: ColumnType.Action,
          }),
        ],
        data: [
          {
            name: 'Shirt',
            size: 'Small, Medium',
            price: 14.99,
            discount: 14.99,
          },
        ],
        isDisplayAction: (
          btn: ButtonControl,
          data: Record<string, unknown>,
        ) => {
          const exam = data as unknown as ExamDto
          if (!exam) return false
          if (exam.status == ExamStatus.Marked) {
            if (btn.name == 'mark-again') {
              return true
            }
            return false
          } else if (btn.name == 'mark-again') {
            return false
          }
          return true
        },
      }),
    )
    const isLoading = ref(false)
    const loadingControl = ref(
      new LoadingControl({
        type: LoadingType.LoadingNormal,
      }),
    )
    async function handleLoadData() {
      const testService = new TestService()
      const result = await testService.getExamMark(props.test?.test_id)
      tableControl.value.data = result as unknown as Array<
        Record<string, unknown>
      >
    }
    async function onMarkAllExam() {
      const testService = new TestService()
      const result = await testService.markAllExam(props.test?.test_id)
      tableControl.value.data = result as unknown as Array<
        Record<string, unknown>
      >
    }
    async function onActionRecord(btn: ButtonControl, item: ExamDto) {
      if (btn && (btn.name == 'mark' || btn.name == 'mark-again')) {
        const examService = new ExamService()
        const result = (await examService.markExam(
          item.exam_id,
        )) as unknown as ExamDto
        item.point = result.point
      }
    }
    return {
      markAllExamBtn,
      tableControl,
      isLoading,
      loadingControl,
      handleLoadData,
      onMarkAllExam,
      onActionRecord,
    }
  },
  async mounted() {
    this.isLoading = true
    await this.handleLoadData()
    this.isLoading = false
  },
}
</script>
<template src="./mark-list-test.html"></template>
<style src="./mark-list-test.scss" lang="scss" />

<script lang="ts">
import EQuestion from '@/components/question/EQuestion.vue'
import ETableLabel from '@/components/core/components/table-label/ETableLabel.vue'
import EPaging from '@/components/core/components/paging/EPaging.vue'
import { ref } from 'vue'
import { PagingControl } from '@/components/core/models/paging/paging-control'
import EButton from '@/components/core/components/button/EButton.vue'
import { TestDto } from '@/models/test/test-dto'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import TestService from '@/services/test-service'
import { PagingParam } from '@/components/core/models/paging/paging-param'
import router from '@/router'
import { RouterNameExam, RouterNameTest } from '@/components/core/enums/Router'
import ExamService from '@/services/exam-service'
import type { Exam } from '@/models/exam/exam'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import { User } from '@/models/user/user'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { Role } from '@/enums/role'
export default {
  components: {
    EQuestion,
    EButton,
    ETableLabel,
    EPaging,
  },
  setup() {
    const { t } = useI18n()
    const tests = ref<TestDto[]>([])
    const createTestBtn = ref(
      new ButtonControl({
        classType: 'solid',
        name: 'CreateTest',
        label: t('i18nTest.CreateTest'),
      }),
    )
    const doTestBtn = ref(
      new ButtonControl({
        name: 'DoTest',
        label: t('i18nTest.Button.DoTest'),
      }),
    )
    const doTestAgainBtn = ref(
      new ButtonControl({
        name: 'DoTestAgain',
        label: t('i18nTest.Button.DoTestAgain'),
        styleClass: 'btn-do-test-again',
      }),
    )
    const markTestBtn = ref(
      new ButtonControl({
        name: 'MarkTest',
        label: t('i18nTest.Button.MarkTest'),
      }),
    )
    const reportTestBtn = ref(
      new ButtonControl({
        name: 'ReportTest',
        label: t('i18nTest.Button.ReportTest'),
      }),
    )
    const editTestBtn = ref(
      new ButtonControl({
        name: 'EditTest',
        label: t('i18nTest.Button.EditTest'),
        styleClass: 'btn-edit-test',
      }),
    )
    const historyTestBtn = ref(
      new ButtonControl({
        name: 'History',
        label: t('i18nTest.Button.History'),
        styleClass: 'btn-history-test',
      }),
    )
    const tryTestBtn = ref(
      new ButtonControl({
        name: 'TryTest',
        label: t('i18nTest.Button.TryTest'),
        styleClass: 'btn-try-test',
      }),
    )
    const pagingControl = ref(new PagingControl())
    // Object lưu trữ các refs động
    function formatDateTime(dateTime: Date) {
      // Chuỗi ngày giờ ban đầu
      const dateString = dateTime.toString()

      // Parse chuỗi ngày giờ sử dụng moment
      const date = moment(dateString)

      // Format ngày giờ theo định dạng mong muốn
      const formattedDate = date.format('DD/MM/YYYY HH:mm')
      return formattedDate
    }
    async function loadData(pagingParam: PagingParam) {
      const testService = new TestService()
      const resultTest = await testService.getPaging(pagingParam)
      tests.value = resultTest as unknown as TestDto[]
    }
    function buildPagingParam() {
      const pagingParam = new PagingParam({
        page: pagingControl.value.currentPage,
        take: 20,
      })
      return pagingParam
    }
    function onMarkTest(test: TestDto) {
      router.push({
        name: RouterNameTest.Mark,
        params: {
          test_id: test.test_id,
        },
      })
    }
    function onDoTest(test: TestDto) {
      router.push({
        name: RouterNameTest.Do,
        params: {
          test_id: test.test_id,
        },
      })
    }
    function isShowBtnAction(btn: ButtonControl, test: TestDto) {
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (user && user.role_id == Role.Student) {
        if (
          btn.name == 'DoTest' ||
          btn.name == 'History' ||
          btn.name == 'ReportTest'
        )
          return true
      } else if (user && user.role_id == Role.Teacher) {
        if (
          btn.name == 'EditTest' ||
          btn.name == 'TryTest' ||
          btn.name == 'ReportTest' ||
          btn.name == 'MarkTest'
        )
          return true
      } else if (user && user.role_id == Role.Admin) {
        return true
      }
      return false
    }
    async function onDoTestAgain(test: TestDto) {
      const examService = new ExamService()
      const newExam = (await examService.doNewExam(
        test.test_id,
      )) as unknown as Exam
      if (newExam) {
        router.push({
          name: RouterNameExam.Do,
          params: {
            exam_id: newExam.exam_id,
          },
        })
      }
    }
    function onEditTest(test: TestDto) {
      router.push({
        name: RouterNameTest.Edit,
        params: {
          test_id: test.test_id,
        },
      })
    }
    function onReportTest(test: TestDto) {
      router.push({
        name: RouterNameTest.Summary,
        params: {
          test_id: test.test_id,
        },
      })
    }
    function onHistoryTest(test: TestDto) {
      router.push({
        name: RouterNameTest.History,
        params: {
          test_id: test.test_id,
        },
      })
    }
    function onCreateTest() {
      router.push({
        name: RouterNameTest.Add,
        params: {},
      })
    }
    return {
      formatDateTime,
      isShowBtnAction,
      createTestBtn,
      pagingControl,
      tests,
      doTestBtn,
      doTestAgainBtn,
      editTestBtn,
      historyTestBtn,
      tryTestBtn,
      markTestBtn,
      reportTestBtn,
      onMarkTest,
      onDoTest,
      onDoTestAgain,
      onEditTest,
      onHistoryTest,
      onReportTest,
      loadData,
      buildPagingParam,
      onCreateTest,
    }
  },
  mounted() {
    const pagingParam = this.buildPagingParam()
    this.loadData(pagingParam)
  },
}
</script>

<template src="./test-library.html"></template>
<style src="./test-library.scss" scoped lang="scss"></style>

<script lang="ts">
import EQuestion from '@/components/question/EQuestion.vue'
import ETableLabel from '@/components/core/components/table-label/ETableLabel.vue'
import EPaging from '@/components/core/components/paging/EPaging.vue'
import { ref } from 'vue'
import { PagingControl } from '@/components/core/models/paging/paging-control'
import EButton from '@/components/core/components/button/EButton.vue'
import QuestionCreatePopup from '@views/library/popup/QuestionCreatePopup.vue'
import { TestDto } from '@/models/test/test-dto'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import commonFunction from '@/components/core/commons/CommonFunction'
export default {
  components: {
    EQuestion,
    EButton,
    ETableLabel,
    EPaging,
    QuestionCreatePopup,
  },
  setup() {
    const { t } = useI18n()
    const tests = ref<TestDto[]>([
      new TestDto({
        test_id: commonFunction.generateID(),
        name: 'Đề thi cuối kì 1',
      }),
      new TestDto({
        test_id: commonFunction.generateID(),
        name: 'Đề thi cuối kì 2',
      }),
    ])
    const createTestBtn = ref(
      new ButtonControl({
        classType: 'solid',
        label: t('i18nTest.CreateTest'),
      }),
    )
    const doTestBtn = ref(
      new ButtonControl({
        label: t('i18nTest.Button.DoTest'),
      }),
    )
    const doTestAgainBtn = ref(
      new ButtonControl({
        label: t('i18nTest.Button.DoTestAgain'),
        styleClass: 'btn-do-test-again',
      }),
    )
    const editTestBtn = ref(
      new ButtonControl({
        label: t('i18nTest.Button.EditTest'),
        styleClass: 'btn-edit-test',
      }),
    )
    const historyTestBtn = ref(
      new ButtonControl({
        label: t('i18nTest.Button.History'),
        styleClass: 'btn-history-test',
      }),
    )
    const tryTestBtn = ref(
      new ButtonControl({
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
    function onClickTest(test: TestDto) {}
    function onDoTest(test: TestDto) {}
    function onDoTestAgain(test: TestDto) {}
    function onEditTest(test: TestDto) {}
    function onTryTest(test: TestDto) {}
    return {
      formatDateTime,
      createTestBtn,
      pagingControl,
      tests,
      doTestBtn,
      doTestAgainBtn,
      editTestBtn,
      historyTestBtn,
      tryTestBtn,
      onClickTest,
      onDoTest,
      onDoTestAgain,
      onEditTest,
      onTryTest,
    }
  },
}
</script>

<template src="./test-library.html"></template>
<style src="./test-library.scss" scoped lang="scss"></style>

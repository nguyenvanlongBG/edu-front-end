<script lang="ts">
import EButton from '@/components/core/components/button/EButton.vue'
import ECombobox from '@/components/core/components/combobox/ECombobox.vue'
import ELoading from '@/components/core/components/loading/ELoading.vue'
import ENumber from '@/components/core/components/number/ENumber.vue'
import EPaging from '@/components/core/components/paging/EPaging.vue'
import EPopup from '@/components/core/components/popup/EPopup.vue'
import { LoadingType } from '@/components/core/enums/Common'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { ComboboxControl } from '@/components/core/models/combobox/combobox-control'
import { LoadingControl } from '@/components/core/models/loading/loading-control'
import { NumberControl } from '@/components/core/models/number/number-control'
import { PagingControl } from '@/components/core/models/paging/paging-control'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import EQuestion from '@/components/question/EQuestion.vue'
import type { Chapter } from '@/models/chapter/chapter'
import { ChapterGenQuestionConfig } from '@/models/test/auto-gen-test-param.ts/chapter-gen-question-config'
import { ParamAutoGenTest } from '@/models/test/auto-gen-test-param.ts/param-auto-gen-test'
import ChapterService from '@/services/chapter-service'
import TestService from '@/services/test-service'
import { level } from '@/stores/level'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
interface SettingChapterControl {
  chapter: ComboboxControl
  numberQuestionRecognition: NumberControl
  numberQuestionComprehension: NumberControl
  numberQuestionApplication: NumberControl
  numberQuestionAdvancedApplication: NumberControl
}
export default {
  components: {
    EQuestion,
    ELoading,
    EButton,
    EPopup,
    EPaging,
    ENumber,
    ECombobox,
  },
  props: {
    control: {
      type: PopupControl,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const isLoading = ref(false)
    const loadingControl = ref(
      new LoadingControl({
        type: LoadingType.LoadingNormal,
      }),
    )
    const cancelBtn = new ButtonControl({
      label: t('i18nButton.cancel'),
    })
    const saveBtn = new ButtonControl({
      label: t('i18nButton.agree'),
      classType: 'solid',
    })
    const addChapterConfigBtn = new ButtonControl({
      label: 'Thêm',
      classType: 'solid',
    })
    const chapterControls = ref<Array<SettingChapterControl>>([])
    const pagingControl = ref(new PagingControl())
    const chapters = ref([] as Chapter[])
    function changeLoading(loadingStatus: boolean = false) {
      isLoading.value = loadingStatus
    }
    async function onSave() {
      const control = props.control
      if (control && typeof control.handleEmit == 'function') {
        const paramAutoGenTest = new ParamAutoGenTest({
          chapters: chapterControls.value.map(control => {
            return new ChapterGenQuestionConfig({
              chapter_id: control.chapter.value as string,
              Recognition: control.numberQuestionRecognition.value ?? 0,
              Comprehension: control.numberQuestionComprehension.value ?? 0,
              Application: control.numberQuestionApplication.value ?? 0,
              AdvancedApplication:
                control.numberQuestionAdvancedApplication.value ?? 0,
            })
          }),
        })
        const testService = new TestService()
        const questions = await testService.autoGenQuestion(
          paramAutoGenTest as unknown as Record<string, unknown>,
        )
        control.handleEmit('ok', questions)
      }
    }
    function onAddConfigChapter() {
      const newChapterControl = {
        chapter: new ComboboxControl({
          displayField: 'name',
          valueField: 'chapter_id',
          data: chapters.value,
          isOnlySelect: true,
        }),
        numberQuestionRecognition: new NumberControl({
          value: 0,
        }),
        numberQuestionComprehension: new NumberControl({
          value: 0,
        }),
        numberQuestionApplication: new NumberControl({
          value: 0,
        }),
        numberQuestionAdvancedApplication: new NumberControl({
          value: 0,
        }),
      } as SettingChapterControl
      if (!chapterControls.value) {
        chapterControls.value = []
      }
      chapterControls.value.push(newChapterControl)
    }
    return {
      isLoading,
      loadingControl,
      level,
      cancelBtn,
      saveBtn,
      addChapterConfigBtn,
      pagingControl,
      chapterControls,
      chapters,
      changeLoading,
      onAddConfigChapter,
      onSave,
    }
  },
  async mounted() {
    const chapterService = new ChapterService()
    const chaptersResult = await chapterService.filter([])
    this.chapters = chaptersResult as unknown as Chapter[]
  },
}
</script>
<template src="./popup-auto-gen-question.html"></template>
<style src="./popup-auto-gen-question.scss" lang="scss" />

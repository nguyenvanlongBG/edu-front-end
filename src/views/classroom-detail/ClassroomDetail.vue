<template src="./classroom-detail.html"></template>
<script lang="ts">
import { defineComponent } from 'vue'
import EButton from '@core/components/button/EButton.vue'
import EPopup from '@core/components/popup/EPopup.vue'
import { ButtonControl } from '@core/models/button/button-control'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { useI18n } from 'vue-i18n'
import EQuestion from '@/components/question/EQuestion.vue'
import { Classroom } from '@/models/classroom/classroom'
import { ModelState } from '@/components/core/enums/model-state'

export default defineComponent({
  components: {
    EPopup,
    EButton,
    EQuestion,
  },
  props: {
    control: {
      type: PopupControl,
      required: true,
    },
    masterData: {
      type: Classroom,
      required: true,
    },
  },
  emits: ['change', 'close'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const cancelBtn = new ButtonControl({
      label: t('i18nButton.cancel'),
    })
    const saveBtn = new ButtonControl({
      label: t('i18nButton.save'),
      classType: 'solid',
    })

    function getTitle() {
      if (props.masterData) {
        if (props.masterData.State == ModelState.INSERT) {
          return t('i18nClassroom.AddClassroom')
        } else if (props.masterData.State == ModelState.EDIT) {
          return t('i18nClassroom.EditClassroom')
        }
      }
      return ''
    }
    function onClose() {
      props.control.handleEmit('close')
    }
    return {
      getTitle,
      cancelBtn,
      saveBtn,
      onClose,
    }
  },
})
</script>

<style src="./classroom-detail.scss" scoped></style>

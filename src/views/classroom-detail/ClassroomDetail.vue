<template src="./classroom-detail.html"></template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import EButton from '@core/components/button/EButton.vue'
import EPopup from '@core/components/popup/EPopup.vue'
import { ButtonControl } from '@core/models/button/button-control'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { useI18n } from 'vue-i18n'
import EQuestion from '@/components/question/EQuestion.vue'
import { Classroom } from '@/models/classroom/classroom'
import { ModelState } from '@/components/core/enums/model-state'
import { InputControl } from '@/components/core/models/input/input-control'
import EInput from '@/components/core/components/input/EInput.vue'
import ClassroomService from '@/services/classroom-service'

export default defineComponent({
  components: {
    EPopup,
    EButton,
    EQuestion,
    EInput,
  },
  props: {
    control: {
      type: PopupControl,
      required: false,
      default: () => new PopupControl(),
    },
    masterData: {
      type: Classroom,
      required: true,
    },
  },
  emits: ['change', 'close'],
  setup(props) {
    const { t } = useI18n()
    const masterDataLocal = ref(props.masterData)
    const classroomService = new ClassroomService()
    const txtClassroomName = ref(
      new InputControl({
        label: t('i18nClassroom.ClassroomName'),
        placeholder: t('i18nClassroom.ClassroomName'),
      }),
    )
    const txtClassroomCode = ref(
      new InputControl({
        label: t('i18nClassroom.CLassroomCode'),
        placeholder: t('i18nClassroom.CLassroomCode'),
      }),
    )
    const cancelBtn = new ButtonControl({
      label: t('i18nButton.cancel'),
    })
    const saveBtn = new ButtonControl({
      label: t('i18nButton.save'),
      classType: 'solid',
    })

    function getTitle() {
      if (masterDataLocal.value) {
        if (masterDataLocal.value.State == ModelState.INSERT) {
          return t('i18nClassroom.AddClassroom')
        } else if (masterDataLocal.value.State == ModelState.EDIT) {
          return t('i18nClassroom.EditClassroom')
        }
      }
      return ''
    }
    function onClose() {
      props.control.handleEmit('close')
    }
    async function onSave() {
      const resultSave = await classroomService.post(masterDataLocal.value)
      if (resultSave) {
        masterDataLocal.value.classroom_code = (
          resultSave as unknown as Classroom
        ).classroom_code
      }
    }
    return {
      masterDataLocal,
      getTitle,
      cancelBtn,
      saveBtn,
      onClose,
      onSave,
      txtClassroomName,
      txtClassroomCode,
    }
  },
})
</script>

<style src="./classroom-detail.scss" scoped></style>

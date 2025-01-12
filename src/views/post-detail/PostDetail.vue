<template src="./post-detail.html"></template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import EButton from '@core/components/button/EButton.vue'
import EPopup from '@core/components/popup/EPopup.vue'
import { ButtonControl } from '@core/models/button/button-control'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { useI18n } from 'vue-i18n'
import EQuestion from '@/components/question/EQuestion.vue'
import { ModelState } from '@/components/core/enums/model-state'
import EInput from '@/components/core/components/input/EInput.vue'
import { Post } from '@/models/post/post'
import PostService from '@/services/post-service'
import { EditorControl } from '@/components/core/models/editor/editor-control'
import Editor from '@/components/core/components/editor/EEditor.vue'
import editorFunction from '@/components/core/commons/editorFunction'

export default defineComponent({
  components: {
    EPopup,
    EButton,
    EQuestion,
    EInput,
    Editor,
  },
  props: {
    control: {
      type: PopupControl,
      required: false,
      default: () => new PopupControl(),
    },
    masterData: {
      type: Post,
      required: true,
    },
  },
  emits: ['change', 'close'],
  setup(props) {
    const { t } = useI18n()
    const masterDataLocal = ref(props.masterData)
    const postService = new PostService()
    const editorControl = ref(
      new EditorControl({
        isHideToolbar: false,
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
      if (props.masterData) {
        if (props.masterData.State == ModelState.INSERT) {
          return t('i18nPost.CreatePost')
        } else if (props.masterData.State == ModelState.EDIT) {
          return t('i18nPost.EditPost')
        }
      }
      return ''
    }
    function onClose() {
      props.control.handleEmit('close')
    }
    async function onSave() {
      masterDataLocal.value.content = editorFunction.getContent(
        masterDataLocal.value.object_content,
      )
      props.control.handleEmit('save', masterDataLocal.value)
    }
    return {
      masterDataLocal,
      editorControl,
      getTitle,
      postService,
      cancelBtn,
      saveBtn,
      onClose,
      onSave,
    }
  },
})
</script>

<style src="./post-detail.scss" scoped></style>

<template src="./e-note.html"></template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { NoteControl } from '../../models/note/note-control'
import Editor from '../editor/EEditor.vue'
import { EditorControl } from '../../models/editor/editor-control'

export default defineComponent({
  name: 'e-note',
  components: {
    Editor,
  },
  props: {
    control: {
      type: Object as () => NoteControl,
      required: true,
    },
    modelValue: {
      type: Object,
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const innerValue = ref(props.modelValue)
    const editorControl = ref(new EditorControl())
    return {
      innerValue,
      editorControl,
    }
  },
})
</script>

<style src="./e-note.scss" scoped></style>

<template src="./e-note.html"></template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { NoteControl } from '../../models/note/note-control'
import Editor from '../editor/EEditor.vue'
import { EditorControl } from '../../models/editor/editor-control'
import type { Delta } from '@vueup/vue-quill'
import { emit } from 'process'

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
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    innerValue: {
      get() {
        return this.modelValue
      },
      set(value: Delta) {
        this.$emit('update:modelValue', value)
      },
    },
  },

  setup() {
    const editorControl = ref(new EditorControl())
    return {
      editorControl,
    }
  },
})
</script>

<style src="./e-note.scss" scoped></style>

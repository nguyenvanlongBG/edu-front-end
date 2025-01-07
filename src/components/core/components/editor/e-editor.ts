import { defineComponent, ref } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Delta, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ActionEditor } from '@core/enums/Common'
import commonFunction from '@core/commons/CommonFunction'
import { EditorControl } from '@core/models/editor/editor-control'
import PopupMathEditor from './popup/PopupMathEditor.vue'
import { PopupControl } from '../../models/popup/popup-control'
import poupLibrary from '../../library/popup-library'
window.katex = katex
export default defineComponent({
  name: 'e-editor',
  components: { QuillEditor, PopupMathEditor },
  props: {
    control: {
      type: EditorControl,
      required: true,
    },
    modelValue: {
      type: [Array<object>, Object], // Kiểu dữ liệu của modelValue
      required: true,
    },
  },
  emits: ['update:modelValue'],

  watch: {
    modelValue(newValue: Array<object> | object) {
      if (newValue) {
        if (!Array.isArray(newValue)) {
          this.texto = new Delta(
            ('ops' in newValue ? newValue.ops : []) as Array<object>,
          )
        } else {
          this.texto = new Delta(newValue)
        }
      }
    },
  },
  created() {
    const insertData = this.modelValue
    if (!Array.isArray(insertData)) {
      this.texto = new Delta(insertData.ops)
    } else {
      this.texto = new Delta(insertData)
    }
  },
  mounted() {
    if (
      this.editContainerRef &&
      this.editContainerRef.querySelectorAll('.ql-formula')
    ) {
      const formulaElements =
        this.editContainerRef.querySelectorAll('.ql-formula')
      if (!formulaElements || !formulaElements.length) return
      formulaElements.forEach(element => {
        element.addEventListener('click', () => {
          const dataValue = element.getAttribute('data-value')
          if (dataValue) {
            this.showEditMath(dataValue as string, ActionEditor.EDIT)
          }
        })
      })
    }
  },
  setup(props, { emit }) {
    const myQuillEditor = ref<InstanceType<typeof QuillEditor> | null>(null)
    const editContainerRef = ref<HTMLElement | null>(null)
    const actionEditor = ref(ActionEditor.INSERT)
    function showEditMath(
      formulaStr: string = '',
      actionEditor: ActionEditor = ActionEditor.EDIT,
    ) {
      const popupControl = new PopupControl()
      popupControl.handleEmit = (eventName: string, data: string) => {
        if (eventName == 'emitFormula') {
          transferMainEditor(data, actionEditor)
        }
      }
      const component = import('./popup/PopupMathEditor.vue')
      poupLibrary.showPopup(component, {
        control: popupControl,
        formulaValue: formulaStr,
      })
    }
    const idToolbar = 'toolbar-' + commonFunction.generateID()
    const editorOptions = ref({
      modules: {
        toolbar: {
          container: '#' + idToolbar,
          handlers: {
            formula: () => {
              showEditMath('', ActionEditor.INSERT)
            },
          },
        },
      },
    })
    const texto = ref()
    function transferMainEditor(
      formula: string,
      actionEditor: ActionEditor = ActionEditor.EDIT,
    ) {
      if (!myQuillEditor.value) return
      const quillInstance = myQuillEditor.value.getQuill()
      quillInstance.focus()
      const cursorPosition = quillInstance.getSelection()
      const position =
        cursorPosition && cursorPosition.index ? cursorPosition.index : 0
      if (actionEditor == ActionEditor.INSERT) {
        quillInstance.insertEmbed(position, 'formula', formula)
      } else {
        const delta = quillInstance.getContents()
        if (position) {
          delta.ops.splice(position - 1, 1)
        } else {
          delta.ops.splice(0, 1)
        }
        quillInstance.setContents(delta)
        if (position) {
          quillInstance.insertEmbed(position - 1, 'formula', formula)
        } else {
          quillInstance.insertEmbed(0, 'formula', formula)
        }
      }
      if (
        !editContainerRef.value ||
        !editContainerRef.value.querySelectorAll('.ql-formula')
      )
        return
      const formulaElements =
        editContainerRef.value.querySelectorAll('.ql-formula')
      formulaElements.forEach(element => {
        element.addEventListener('click', () => {
          const dataValue = element.getAttribute('data-value')
          if (dataValue) {
            showEditMath(dataValue as string, ActionEditor.EDIT)
          }
        })
      })
    }
    function handleInput(e: Event) {
      formula.value = (e.target as HTMLInputElement).value
    }
    function onUpdate(content: Delta) {
      emit('update:modelValue', content)
    }
    const formula = ref(
      '{\\left(1+x\\right)}^{n}=1+\\frac{nx}{1!}+\\frac{n\\left(n-1\\right){x}^{2}}{2!}+\\dots',
    )
    const macros = {
      smallfrac: {
        args: 2,
        def: '{}^{#1}\\!\\!/\\!{}_{#2}',
        captureSelection: false,
      },
      genfrac: {
        args: 6,
        def: '\\binom{#4}{#3}',
      },
      dots: {
        args: 0,
        def: '...',
        captureSelection: false,
      },
    }
    return {
      macros,
      formula,
      idToolbar,
      editorOptions,
      texto,
      myQuillEditor,
      onUpdate,
      transferMainEditor,
      editContainerRef,
      actionEditor,
      handleInput,
      showEditMath,
    }
  },
})

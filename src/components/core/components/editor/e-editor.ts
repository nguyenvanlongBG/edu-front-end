import { defineComponent, ref } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Delta, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ActionEditor } from '@core/enums/Common'
import commonFunction from '@core/commons/CommonFunction'
import { EditorControl } from '@core/models/editor/editor-control'
import PopupMathEditor from './popup/PopupMathEditor.vue'
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
      type: Array<object>, // Kiểu dữ liệu của modelValue
      required: true,
    },
  },
  created() {
    const insertData = [
      ...this.modelValue,
      {
        insert: '\n',
      },
    ]
    this.texto = new Delta(insertData)
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
          //const dataValue = element.getAttribute('data-value')
          //const formula = dataValue ?? ''
          this.actionEditor = ActionEditor.EDIT
          // this.$q
          //   .dialog({
          //     component: DialogMathEditor,
          //     componentProps: {
          //       formulaProp: formula,
          //     },
          //   })
          //   .onOk((formula: string) => {
          //     this.transferMainEditor(formula);
          //   });
        })
      })
    }
  },
  setup() {
    const myQuillEditor = ref<InstanceType<typeof QuillEditor> | null>(null)
    const editContainerRef = ref<HTMLElement | null>(null)
    const actionEditor = ref(ActionEditor.INSERT)
    const formula = ref(
      '{\\left(1+x\\right)}^{n}=1+\\frac{nx}{1!}+\\frac{n\\left(n-1\\right){x}^{2}}{2!}+\\dots',
    )
    const idToolbar = 'toolbar-' + commonFunction.generateID()
    const editorOptions = ref({
      modules: {
        toolbar: {
          container: '#' + idToolbar,
          handlers: {
            formula: () => {},
          },
        },
      },
    })
    const texto = ref()
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
    const isShowMathEditor = ref<boolean>(false)
    function transferMainEditor(formula: string) {
      if (!myQuillEditor.value) return
      const quillInstance = myQuillEditor.value.getQuill()
      quillInstance.focus()
      const cursorPosition = quillInstance.getSelection()
      const position =
        cursorPosition && cursorPosition.index ? cursorPosition.index : 0
      if (actionEditor.value == ActionEditor.INSERT) {
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
      console.log(quillInstance.getContents())
      if (
        !editContainerRef.value ||
        !editContainerRef.value.querySelectorAll('.ql-formula')
      )
        return
      const formulaElements =
        editContainerRef.value.querySelectorAll('.ql-formula')
      actionEditor.value = ActionEditor.INSERT
      formulaElements.forEach(element => {
        element.addEventListener('click', () => {
          actionEditor.value = ActionEditor.EDIT
          //const dataValue = element.getAttribute('data-value')
          // const formula = dataValue ?? ''
          // console.log(cursorPosition)
          // isShowMathEditor.value = true
          // $q.dialog({
          //   component: DialogMathEditor,
          //   componentProps: {
          //     formulaProp: formula,
          //   },
          // }).onOk((formula: string) => {
          //   me.transferMainEditor(formula);
          // });
        })
      })
    }
    function handleInput(e: Event) {
      formula.value = (e.target as HTMLInputElement).value
      console.log(formula)
    }
    function showMathEditor() {
      isShowMathEditor.value = true
    }
    return {
      macros,
      formula,
      showMathEditor,
      isShowMathEditor,
      idToolbar,
      editorOptions,
      texto,
      myQuillEditor,
      transferMainEditor,
      editContainerRef,
      actionEditor,
      handleInput,
    }
  },
})

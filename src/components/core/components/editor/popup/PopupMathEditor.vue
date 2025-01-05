<template src="./popup-math-editor.html"></template>
<script lang="ts">
import { ButtonControl } from '@/components/core/models/button/button-control'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import EPopup from '@core/components/popup/EPopup.vue'
import EButton from '@core/components/button/EButton.vue'
export default defineComponent({
  name: 'PopupMathEditor',
  emits: ['updateFormula', 'emitFormula'],
  components: {
    EButton,
    EPopup,
  },
  props: {
    control: {
      type: PopupControl,
      required: true,
    },
    formulaValue: {
      type: String,
      required: true,
      default: '',
    },
  },

  created() {
    this.formula = this.formulaValue
  },
  setup(props, ctx) {
    const { t } = useI18n()
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
    const formula = ref(
      '{\\left(1+x\\right)}^{n}=1+\\frac{nx}{1!}+\\frac{n\\left(n-1\\right){x}^{2}}{2!}+\\dots',
    )
    const cancelBtn = new ButtonControl({
      label: t('i18nButton.cancel'),
    })
    const saveBtn = new ButtonControl({
      label: t('i18nButton.save'),
      classType: 'solid',
    })
    function handleInput(e: Event) {
      formula.value = (e.target as HTMLInputElement).value
      props.control.handleEmit('updateFormula', formula.value)
      ctx.emit('updateFormula', formula.value)
    }
    function emitMath() {
      props.control.handleEmit('emitFormula', formula.value)
      ctx.emit('emitFormula', formula.value)
    }
    return {
      macros,
      formula,
      cancelBtn,
      saveBtn,
      handleInput,
      emitMath,
    }
  },
})
</script>

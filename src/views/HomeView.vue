<script lang="ts">
import EInput from '@/components/core/components/input/EInput.vue'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { InputControl } from '@/components/core/models/input/input-control'
import { ref } from 'vue'
export default {
  components: {
    EInput,
  },
  setup() {
    const btnControl1 = ref(
      new ButtonControl({
        label: 'Lưu',
      }),
    )
    const btnControl2 = ref(
      new ButtonControl({
        label: 'Lưu',
        classType: 'solid',
      }),
    )
    const btnControl3 = ref(
      new ButtonControl({
        label: 'Lưu',
        classType: 'outline',
      }),
    )
    const inputControl = ref(new InputControl())
    const value = ref('')
    return {
      btnControl1,
      btnControl2,
      btnControl3,
      inputControl,
      value,
    }
  },
}
</script>

<template>
  <div
    style="padding-left: 100px; padding-top: 100px"
    class="p-l-32px d-flex col-gap-8px"
  >
    <EInput :control="inputControl" v-model="value" />
  </div>
</template>
<style lang="scss">
.list-question {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
</style>

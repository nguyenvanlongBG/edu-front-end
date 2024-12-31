<script lang="ts">
import { Test } from '@/models/test/test'

export default {
  name: 'ExamCard',
  props: {
    exam: {
      type: Test,
      required: true,
    },
  },
}
</script>

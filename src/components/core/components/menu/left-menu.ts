import { defineComponent, ref } from 'vue'
import { Menu } from '@core/enums/Menu'
import GroupMenu from './GroupMenu.vue'
import router from '@/router'
export default defineComponent({
  name: 'left-menu',
  components: {
    GroupMenu,
  },
  setup() {
    const pageFocus = ref(1)

    function navigateToPage(routerName: string) {
      router.push({ name: routerName })
    }
    return { navigateToPage, pageFocus, Menu }
  },
})

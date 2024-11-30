import { defineComponent, ref } from 'vue'
import { Menu } from '@core/enums/Menu'
import GroupMenu from './GroupMenu.vue'
import router from '@/router/index'
export default defineComponent({
  name: 'left-menu',
  components: {
    GroupMenu,
  },
  setup() {
    const pageFocus = ref(1)
    const routerNames = [
      'forum',
      'forum',
      'groups',
      'groups',
      'groups',
      'groups',
      'groups',
    ]
    function navigateToPage(indexItemMenu = 0, params = null) {
      pageFocus.value = indexItemMenu
      console.log(params, routerNames, indexItemMenu)
      router.push({ name: routerNames[indexItemMenu] })
    }
    return { navigateToPage, pageFocus, Menu }
  },
})

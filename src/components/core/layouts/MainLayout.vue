<template>
  <div>
    <TheMenu />
    <div>
      <the-header />
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import TheMenu from '@/components/core/components/menu/LeftMenu.vue'
import TheHeader from '@core/components/header/TheHeader.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  components: {
    TheMenu,
    TheHeader,
  },
})
</script>
<style>
.main-layout {
  display: flex;
}

.main-container {
  flex: 1;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh);
  overflow-y: hidden;
}
</style>

<template>
  <div class="avatar-container">
    <img :src="user.avatarUrl" class="avatar-size" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    user: {
      type: Object,
      required: false,
      default: () => {
        // id: 1,
        // name: 'Test',
        // avatarUrl:
        //   'https://haycafe.vn/wp-content/uploads/2021/11/hinh-anh-hoat-hinh-de-thuong-cute-dep-nhat-600x600.jpg',
      },
    },
  },
})
</script>
<style lang="scss"></style>

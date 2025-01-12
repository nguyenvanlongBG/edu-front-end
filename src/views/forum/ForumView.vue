<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import EButton from '@/components/core/components/button/EButton.vue'
import Editor from '@/components/core/components/editor/EEditor.vue'
import { ModelState } from '@/components/core/enums/model-state'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { EditorControl } from '@/components/core/models/editor/editor-control'
import { PagingParam } from '@/components/core/models/paging/paging-param'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { GuidEmpty } from '@/constants/consstant'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { Role } from '@/enums/role'
import { Post } from '@/models/post/post'
import { User } from '@/models/user/user'
import PostService from '@/services/post-service'
import { ref } from 'vue'

export default {
  components: {
    Editor,
    EButton,
  },
  setup() {
    const editorControl = ref(
      new EditorControl({
        isHideToolbar: true,
        readonly: true,
      }),
    )
    const addPostBtn = ref(
      new ButtonControl({
        label: 'Thêm bài viết',
      }),
    )
    const detailPopupControl = new PopupControl({
      width: '800px',
    })
    const dicStatus = ref({} as Record<string, boolean>)
    function toggleAction(post: Post) {
      if (dicStatus.value && dicStatus.value[post.post_id]) {
        dicStatus.value[post.post_id] = false
      } else {
        dicStatus.value[post.post_id] = true
      }
    }
    const posts = ref([] as Post[])
    async function handleLoadData(param: PagingParam) {
      dicStatus.value = {}
      const postService = new PostService()
      const result = await postService.getPaging(param)
      posts.value = result as unknown as Array<Post>
      posts.value.forEach(post => {
        post.object_content = commonFunction.convertToData<object[]>(
          post.content,
        )
        dicStatus.value[post.post_id] = false
      })
    }
    function getComponentDetail() {
      return import('@views/post-detail/PostDetail.vue')
    }
    function onAddPost() {
      const component = getComponentDetail()
      const newPost = new Post()
      newPost.post_id = commonFunction.generateID()
      newPost.State = ModelState.INSERT
      newPost.group_id = GuidEmpty
      newPost.object_content = []
      const props = buildPropsDetail(
        newPost as unknown as Record<string, unknown>,
      )
      detailPopupControl.show(
        component,
        props,
        async (event: string, data: unknown) => {
          if (event === 'close') {
            detailPopupControl.close() // Đóng popup nếu cần
          } else if (event == 'save') {
            await handleSavePost(data as unknown as Post)
            detailPopupControl.close() // Đóng popup nếu cần
            await handleReloadData()
          }
        },
      )
    }
    function onEditPost(post: Post) {
      const component = getComponentDetail()
      post.State = ModelState.EDIT
      const props = buildPropsDetail(post as unknown as Record<string, unknown>)
      detailPopupControl.show(
        component,
        props,
        async (event: string, data: unknown) => {
          if (event === 'close') {
            detailPopupControl.close() // Đóng popup nếu cần
          } else if (event == 'save') {
            await handleSavePost(data as unknown as Post)
            detailPopupControl.close() // Đóng popup nếu cần
            await handleReloadData()
          }
        },
      )
    }
    function isShowAction(post: Post) {
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (user) {
        if (user.role_id == Role.Admin) {
          return true
        } else {
          return user.user_id == post.user_id
        }
      }
      return false
    }
    async function handleSavePost(post: Post) {
      const postService = new PostService()
      if (post.State == ModelState.INSERT) {
        const user = localStorageLibrary.getValueByKey<User>(
          LocalStorageKey.User,
        )
        if (user) {
          post.user_id = user.user_id
          await postService.post(post)
        }
      } else if (post.State == ModelState.EDIT) {
        await postService.put(post)
      }
    }
    async function handleReloadData() {
      const pagingParam = new PagingParam()
      await handleLoadData(pagingParam)
    }
    function buildPropsDetail(record: Record<string, unknown>) {
      return { masterData: record, control: detailPopupControl }
    }
    return {
      editorControl,
      dicStatus,
      toggleAction,
      handleReloadData,
      handleSavePost,
      posts,
      handleLoadData,
      addPostBtn,
      onAddPost,
      onEditPost,
      detailPopupControl,
      buildPropsDetail,
      isShowAction,
    }
  },
  async mounted() {
    await this.handleReloadData()
  },
}
</script>
<template src="./forum-view.html"></template>
<style src="./forum-view.scss" lang="scss" />

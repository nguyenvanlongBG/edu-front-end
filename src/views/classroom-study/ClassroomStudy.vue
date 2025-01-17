<script lang="ts">
import commonFunction from '@/components/core/commons/CommonFunction'
import localStorageLibrary from '@/components/core/commons/LocalStorageLibrary'
import EButton from '@/components/core/components/button/EButton.vue'
import Editor from '@/components/core/components/editor/EEditor.vue'
import { FilterOperator } from '@/components/core/enums/Common'
import { ModelState } from '@/components/core/enums/model-state'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { EditorControl } from '@/components/core/models/editor/editor-control'
import { FilterCondition } from '@/components/core/models/paging/filter-condition'
import { PagingParam } from '@/components/core/models/paging/paging-param'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { GuidEmpty } from '@/constants/consstant'
import { LocalStorageKey } from '@/constants/local-storage-key'
import { EnrollmentStatus } from '@/enums/classroom'
import { Role } from '@/enums/role'
import type { EnrollmentClass } from '@/models/enrollment-class/enrollment-class'
import { Post } from '@/models/post/post'
import { User } from '@/models/user/user'
import EnrollmentClassService from '@/services/enrollment-class-service'
import PostService from '@/services/post-service'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  components: {
    EButton,
    Editor,
  },
  setup() {
    const isShowListStudent = ref(false)
    const isShowListRequest = ref(false)
    const isShowBoxRequest = ref(false)
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
    const acceptBtn = ref(
      new ButtonControl({
        label: 'Chấp nhận',
        classType: 'solid',
      }),
    )
    const rejectBtn = ref(
      new ButtonControl({
        label: 'Từ chối',
      }),
    )
    const route = useRoute()
    const classroom_id = route.params.classroom_id as string
    const enrolls = ref([] as EnrollmentClass[])
    const enrollSuccess = computed(() => {
      return enrolls.value.filter(e => e.status == EnrollmentStatus.ACCEPT)
    })
    const enrollPending = computed(() => {
      return enrolls.value.filter(e => e.status == EnrollmentStatus.PENDING)
    })
    const detailPopupControl = new PopupControl({
      width: '800px',
    })
    function onToggleUser() {
      if (isShowListStudent.value) {
        isShowListStudent.value = false
      } else {
        isShowListStudent.value = true
      }
    }
    function onToggleRequest() {
      if (isShowListRequest.value) {
        isShowListRequest.value = false
      } else {
        isShowListRequest.value = true
      }
    }
    async function handleLoadData() {
      await handleLoadPostOfClass()
      await handleLoadEnroll()
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
    async function handleLoadPostOfClass() {
      dicStatus.value = {}
      const postService = new PostService()
      const param = buildParamPagingPost()
      const result = await postService.getPaging(param)
      posts.value = result as unknown as Array<Post>
      posts.value.forEach(post => {
        post.object_content = commonFunction.convertToData<object[]>(
          post.content,
        )
        dicStatus.value[post.post_id] = false
      })
    }
    function buildParamPagingPost() {
      const param = new PagingParam()
      const filters = [
        new FilterCondition({
          Field: 'group_id',
          Operator: FilterOperator.Equal,
          Value: classroom_id,
        }),
      ]
      param.filters = filters
      return param
    }
    async function handleLoadEnroll() {
      const enrollService = new EnrollmentClassService()
      const result = await enrollService.enrollsOfClass(classroom_id)
      enrolls.value = result as unknown as EnrollmentClass[]
    }
    function buildFilterEnroll() {
      return [
        new FilterCondition({
          Field: 'classroom_id',
          Operator: FilterOperator.Equal,
          Value: classroom_id,
        }),
      ]
    }
    function initData() {
      const user = localStorageLibrary.getValueByKey<User>(LocalStorageKey.User)
      if (
        user &&
        (user.role_id == Role.Admin || user?.role_id == Role.Teacher)
      ) {
        isShowBoxRequest.value = true
      } else {
        isShowBoxRequest.value = false
      }
    }
    function getComponentDetail() {
      return import('@views/post-detail/PostDetail.vue')
    }
    function onAddPost() {
      const component = getComponentDetail()
      const newPost = new Post()
      newPost.post_id = commonFunction.generateID()
      newPost.State = ModelState.INSERT
      newPost.group_id = classroom_id
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
            await handleLoadData()
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
            await handleLoadData()
          }
        },
      )
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
    function buildPropsDetail(record: Record<string, unknown>) {
      return { masterData: record, control: detailPopupControl }
    }
    async function onAcceptRequest(enroll: EnrollmentClass) {
      const enrolmentService = new EnrollmentClassService()
      enroll.State = ModelState.EDIT
      enroll.status = EnrollmentStatus.ACCEPT
      await enrolmentService.put(enroll)
    }
    async function onRejectRequest(enroll: EnrollmentClass) {
      const enrolmentService = new EnrollmentClassService()
      enroll.State = ModelState.EDIT
      enroll.status = EnrollmentStatus.REJECT
      await enrolmentService.put(enroll)
    }
    const dicStatus = ref({} as Record<string, boolean>)
    function toggleAction(post: Post) {
      if (dicStatus.value && dicStatus.value[post.post_id]) {
        dicStatus.value[post.post_id] = false
      } else {
        dicStatus.value[post.post_id] = true
      }
    }
    const posts = ref([] as Post[])
    return {
      dicStatus,
      handleSavePost,
      isShowAction,
      detailPopupControl,
      getComponentDetail,
      onEditPost,
      onAddPost,
      toggleAction,
      addPostBtn,
      editorControl,
      buildParamPagingPost,
      posts,
      onToggleUser,
      onToggleRequest,
      acceptBtn,
      rejectBtn,
      isShowBoxRequest,
      isShowListRequest,
      enrolls,
      buildFilterEnroll,
      enrollPending,
      enrollSuccess,
      classroom_id,
      isShowListStudent,
      handleLoadData,
      handleLoadPostOfClass,
      handleLoadEnroll,
      initData,
      onAcceptRequest,
      onRejectRequest,
    }
  },
  created() {
    this.initData()
  },
  async mounted() {
    await this.handleLoadData()
  },
}
</script>
<template src="./classroom-study.html"></template>
<style src="./classroom-study.scss" lang="scss" />

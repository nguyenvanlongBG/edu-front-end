<template src="./classroom-list.html"></template>
<style src="./classroom-list.scss" scoped></style>

<script lang="ts">
import { ref, computed } from 'vue'
import EClassroom from '@components/classroom/EClassroom.vue'
import EInput from '@/components/core/components/input/EInput.vue'
import EPaging from '@/components/core/components/paging/EPaging.vue'
import { PagingControl } from '@/components/core/models/paging/paging-control'
import { InputControl } from '@/components/core/models/input/input-control'
import EButton from '@/components/core/components/button/EButton.vue'
import { ButtonControl } from '@/components/core/models/button/button-control'
import { useI18n } from 'vue-i18n'
import { PagingParam } from '@/components/core/models/paging/paging-param'
import { Classroom } from '@/models/classroom/classroom'
import ClassroomService from '@/services/classroom-service'
import { PopupControl } from '@/components/core/models/popup/popup-control'
import { ModelState } from '@/components/core/enums/model-state'
import { FilterCondition } from '@/components/core/models/paging/filter-condition'
import { FilterOperator } from '@/components/core/enums/Common'

export default {
  name: 'ClassroomList',
  components: {
    EClassroom,
    EPaging,
    EInput,
    EButton,
  },
  setup() {
    const { t } = useI18n()
    const classrooms = ref<Classroom[]>([])

    const searchQuery = ref('')
    const searchClassControl = ref(
      new InputControl({
        placeholder: 'Tìm kiếm lớp học...',
        styleClass: 'search-input',
        value: '12A5',
      }),
    )
    const createClassBtn = ref(
      new ButtonControl({
        classType: 'outline',
        label: t('i18nClassroom.CreateClassroom'),
      }),
    )
    const currentPage = ref(1)
    const itemsPerPage = ref(4)
    const pagingControl = ref(new PagingControl())
    const detailPopupControl = new PopupControl()
    function onClassroom(classroom: Classroom) {
      classroom.State = ModelState.EDIT
      viewDetail(classroom as unknown as Record<string, unknown>)
    }
    const changePage = (page: number) => {
      currentPage.value = page
    }
    function onAddClassroom() {
      const newClassroom = new Classroom()
      newClassroom.State = ModelState.INSERT
      viewDetail(newClassroom as unknown as Record<string, unknown>)
    }
    function getComponentDetail() {
      return import('@views/classroom-detail/ClassroomDetail.vue')
    }
    function viewDetail(record: Record<string, unknown>) {
      const component = getComponentDetail()
      const props = buildPropsDetail(record)
      detailPopupControl.show(component, props, event => {
        if (event === 'close') {
          detailPopupControl.close() // Đóng popup nếu cần
        }
      })
    }
    function buildPropsDetail(record: Record<string, unknown>) {
      return { masterData: record, control: detailPopupControl }
    }
    async function loadListData() {
      const classroomService = new ClassroomService()
      const pagingParam = buildPagingParam()
      const dataRes = await classroomService.getPaging(pagingParam)
      classrooms.value = dataRes as unknown as Classroom[]
    }
    function buildPagingParam() {
      const pagingParam = new PagingParam({
        page: pagingControl.value.currentPage,
        take: 20,
      })
      if (searchClassControl.value && searchClassControl.value.value) {
        const filters = [
          new FilterCondition({
            Field: 'name',
            Operator: FilterOperator.Contains,
            Value: searchClassControl.value.value,
          }),
        ]
        pagingParam.filters = filters
      }
      return pagingParam
    }
    async function onBlurSearchClass() {
      await loadListData()
    }
    return {
      detailPopupControl,
      onClassroom,
      onAddClassroom,
      onBlurSearchClass,
      pagingControl,
      createClassBtn,
      searchClassControl,
      classrooms,
      searchQuery,
      currentPage,
      itemsPerPage,
      changePage,
      loadListData,
      buildPagingParam,
      getComponentDetail,
      buildPropsDetail,
      viewDetail,
    }
  },
  mounted() {
    this.loadListData()
  },
}
</script>

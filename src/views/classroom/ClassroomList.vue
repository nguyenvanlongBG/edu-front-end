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
    const classrooms = ref([
      { id: 1, name: 'Lớp Toán', image: '../assets/picture/classroom.png' },
      { id: 2, name: 'Lớp Văn', image: '../assets/picture/classroom.png' },
      { id: 3, name: 'Lớp Anh', image: '../assets/picture/classroom.png' },
      { id: 4, name: 'Lớp Lý', image: '../assets/picture/classroom.png' },
      { id: 5, name: 'Lớp Hóa', image: '../assets/picture/classroom.png' },
      { id: 6, name: 'Lớp Sinh', image: '../assets/picture/classroom.png' },
      { id: 7, name: 'Lớp Sử', image: '../assets/picture/classroom.png' },
      { id: 8, name: 'Lớp Địa', image: '../assets/picture/classroom.png' },
      { id: 9, name: 'Lớp Tin học', image: '../assets/picture/classroom.png' },
      {
        id: 10,
        name: 'Lớp Nghệ thuật',
        image: '../assets/picture/classroom.png',
      },
    ])

    const searchQuery = ref('')
    const inputControl = ref(
      new InputControl({
        placeholder: 'Tìm kiếm lớp học...',
        styleClass: 'search-input',
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
    const filteredClassrooms = computed(() => {
      return classrooms.value.filter(classroom =>
        classroom.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    })

    const goToClassroom = (id: string) => {
      alert(`Đi tới lớp học có ID: ${id}`)
    }
    const changePage = (page: number) => {
      currentPage.value = page
    }
    return {
      pagingControl,
      createClassBtn,
      inputControl,
      classrooms,
      searchQuery,
      currentPage,
      itemsPerPage,
      filteredClassrooms,
      goToClassroom,
      changePage,
    }
  },
}
</script>

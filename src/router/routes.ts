import { RouterNameExam, RouterNameTest } from '@/components/core/enums/Router'
import { ExamMode } from '@/enums/exam'
import { ExamDto } from '@/models/exam/Dto/exam-dto'
import { TestDto } from '@/models/test/test-dto'
import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@core/layouts/MainLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@views/authen/LoginComponent.vue'),
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@views/authen/RegisterComponent.vue'),
      },
      {
        path: '/forum',
        name: 'forum',
        component: () => import('@views/forum/ForumView.vue'),
      },
      {
        path: '/test',
        name: 'test',
        children: [
          {
            path: '',
            name: RouterNameTest.Add,
            component: () => import('@views/test/TestDetail.vue'),
          },
          {
            path: 'list',
            name: 'list-test',
            component: () => import('@views/test/TestDetail.vue'),
          },
          {
            path: ':test_id',
            name: RouterNameTest.View,
            component: () => import('@views/test/TestDetail.vue'),
          },
          {
            path: ':test_id/edit',
            name: RouterNameTest.Edit,
            component: () => import('@views/test/TestDetail.vue'),
          },
          {
            path: ':test_id/do',
            name: RouterNameTest.Do,
            component: () => import('@views/test/TestDetail.vue'),
          },
          {
            path: ':test_id/mark',
            name: RouterNameTest.Mark,
            component: () => import('@views/test/mark/MarkListTest.vue'),
            props: route => ({
              test: new TestDto({
                test_id: route.params.test_id as string,
              }),
            }),
          },
          {
            path: ':test_id/history',
            name: RouterNameTest.History,
            component: () => import('@views/exam/history/HistoryExams.vue'),
          },
        ],
      },
      {
        path: '/exam',
        name: 'exam',
        children: [
          {
            path: ':exam_id',
            name: RouterNameExam.View,
            component: () => import('@views/exam/ExamDetail.vue'),
            props: route => ({
              exam: new ExamDto({
                exam_id: route.params.exam_id as string,
                mode: ExamMode.Do,
              }),
            }),
          },
          {
            path: ':exam_id/do',
            name: RouterNameExam.Do,
            component: () => import('@views/exam/ExamDetail.vue'),
            props: route => ({
              exam: new ExamDto({
                exam_id: route.params.exam_id as string,
                mode: ExamMode.Do,
              }),
            }),
          },
          {
            path: ':exam_id/mark',
            name: RouterNameExam.Mark,
            component: () => import('@views/exam/ExamDetail.vue'),
            props: route => ({
              exam: new ExamDto({
                exam_id: route.params.exam_id as string,
                mode: ExamMode.Mark,
              }),
            }),
          },
          {
            path: ':exam_id/history',
            name: RouterNameExam.History,
            component: () => import('@views/exam/ExamDetail.vue'),
            props: route => ({
              exam: new ExamDto({
                exam_id: route.params.exam_id as string,
                mode: ExamMode.History,
              }),
            }),
          },
        ],
      },
      {
        path: '/report',
        name: 'report',
        children: [
          {
            path: 'test',
            name: 'report-test',
            component: () => import('@views/report/report-test/ReportTest.vue'),
          },
          {
            path: 'chapter',
            name: 'report-chapter',
            component: () =>
              import('@views/report/report-chapter/ReportChapter.vue'),
          },
          {
            path: 'level',
            name: 'report-level',
            component: () =>
              import('@views/report/report-level/ReportLevel.vue'),
          },
        ],
      },
      {
        path: '/classroom',
        name: 'classroom',
        children: [
          {
            path: '',
            name: 'list',
            component: () => import('@views/classroom/ClassroomList.vue'),
          },
          {
            path: ':classroom_id',
            name: 'classroom-detail',
            component: () =>
              import('@views/classroom-study/ClassroomStudy.vue'),
          },
        ],
      },
      {
        path: '/library',
        name: 'library',
        children: [
          {
            path: '',
            name: 'question-library',
            component: () => import('@views/library/QuestionLibrary.vue'),
          },
          {
            path: 'test',
            name: 'test-library',
            component: () => import('@views/library/test/TestLibrary.vue'),
          },
        ],
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@views/ErrorNotFound.vue'),
  },
]
export default routes

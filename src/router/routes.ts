import { RouterNameExam, RouterNameTest } from '@/components/core/enums/Router'
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
        path: '/home-view',
        name: 'homeview',
        component: () => import('@views/HomeView.vue'),
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
            path: ':test_id/history',
            name: RouterNameTest.History,
            component: () => import('@views/test/TestDetail.vue'),
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
          },
          {
            path: ':exam_id/do',
            name: RouterNameExam.Do,
            component: () => import('@views/exam/ExamDetail.vue'),
          },
          {
            path: ':exam_id/mark',
            name: RouterNameExam.Mark,
            component: () => import('@views/exam/ExamDetail.vue'),
          },
          {
            path: ':exam_id/history',
            name: RouterNameExam.History,
            component: () => import('@views/exam/ExamDetail.vue'),
          },
        ],
      },
      {
        path: '/report',
        name: 'report',
        children: [
          {
            path: '',
            name: 'report-test',
            component: () => import('@views/report/report-test/ReportTest.vue'),
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
        ],
      },
      {
        path: '/library',
        name: 'library',
        children: [
          {
            path: '',
            name: 'question',
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

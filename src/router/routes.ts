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
            name: 'create-test',
            component: () => import('@views/test/TestView.vue'),
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

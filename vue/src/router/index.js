import { createRouter, createWebHistory } from 'vue-router';
import Index from '../views/Index.vue';
import Login from '@/views/Login'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Web',
    component: Index
  },

  //router后台页面
  {
    path: '/hello',
    name: 'Index',
    component: Index,
    children: [
        {
          meta: {history: true, title: "管理员"},
          path: '/hello/codeying/admin',
          name: 'admin',
          component: () => import('../views/admin/Index.vue')
        },
        {
          meta: {history: true, title: "学生"},
          path: '/hello/codeying/student',
          name: 'student',
          component: () => import('../views/student/Index.vue')
        },
        {
          meta: {history: true, title: "班级"},
          path: '/hello/codeying/clazz',
          name: 'clazz',
          component: () => import('../views/clazz/Index.vue')
        },
        {
          meta: {history: true, title: "课程"},
          path: '/hello/codeying/course',
          name: 'course',
          component: () => import('../views/course/Index.vue')
        },
        {
          meta: {history: true, title: "成绩"},
          path: '/hello/codeying/score',
          name: 'score',
          component: () => import('../views/score/Index.vue')
        },
    ]
  }
]
//创建路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
//路由跳转
router.beforeEach((to, from, next) => {
  if(to.meta.history === true) {
    Cache.dispatch("menu", 'addHistory', to);
  }
  next()
})

export default router


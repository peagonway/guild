
import { createRouter, createWebHistory } from 'vue-router'


export default createRouter({
  history: createWebHistory(),
  routes:[
    {
      path:'/phase',
      component: () => import('./views/phase/List.vue')
    },
    {
      path:'/createphase',
      name: 'createphase',
      component: () => import('./views/phase/Edit.vue')
    },
    {
      path: '/editphase',
      name: 'editphase',
      component: () => import('./views/phase/Edit.vue')
    },
    {
      path: '/userlist',
      component: () => import('./views/user/List.vue')
    },
    {
      path: '/adduser',
      name: 'adduser',
      component: () => import('./views/user/Edit.vue')
    },
    {
      path: '/edituser',
      name: 'edituser',
      component: () => import('./views/user/Edit.vue')
    },
    {
      path: '/score',
      component: () => import('./views/score/Score.vue')
    },
    {
      path: '/',
      redirect: '/phase'
    }
  ]
})
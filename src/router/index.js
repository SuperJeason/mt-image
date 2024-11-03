import { createRouter, createWebHistory } from 'vue-router'
import history from '@/views/history.vue'
import upload from '@/views/upload.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: upload },
    { path: '/history', component: history },
    { path: '/upload', component: upload },
  ]
})

export default router

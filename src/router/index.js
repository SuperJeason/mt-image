import { createRouter, createWebHistory } from 'vue-router'
import history from '@/views/history.vue'
import upload from '@/views/upload.vue'
import index from '@/views/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: index },
    { path: '/history', component: history },
    { path: '/upload', component: upload },
    { path: '/index', component: index },
  ]
})

export default router

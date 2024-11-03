import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
// 注册 Waterfall 和 LazyImg 组件
app.component('Waterfall', Waterfall)
app.component('LazyImg', LazyImg)
// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')

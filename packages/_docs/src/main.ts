import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style/global.css'
import App from './app.vue'
import router from '@/router/index'
import i18n from '@/language/i18n'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(i18n)

app.mount('#app')
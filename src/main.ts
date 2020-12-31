import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

const app = createApp(App)
// app.config.devtools = process.env.NODE_ENV === 'development'
app.use(store)
app.use(router)
app.mount('#app')

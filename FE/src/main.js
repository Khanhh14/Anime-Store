import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'

import './assets/tailwind.css' 
import { FontAwesomeIcon } from './plugins/fontawesome'
import GoogleSignInPlugin from 'vue3-google-signin'

// Import Toast và options từ plugin
import Toast, { toastOptions } from './plugins/toast.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)   
app.use(router)  
app.use(Toast, toastOptions) // Đăng ký Toast

app.use(GoogleSignInPlugin, {
  clientId: '911076441690-50oqg4h5a2g8ltr0v393g5tobkklb0lp.apps.googleusercontent.com',
})

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
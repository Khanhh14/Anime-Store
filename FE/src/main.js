import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'  
import { FontAwesomeIcon } from './plugins/fontawesome'


import GoogleSignInPlugin from 'vue3-google-signin'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)   
app.use(router)  


app.use(GoogleSignInPlugin, {
  clientId: '911076441690-50oqg4h5a2g8ltr0v393g5tobkklb0lp.apps.googleusercontent.com',
})

app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
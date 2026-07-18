import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'  
import { FontAwesomeIcon } from './plugins/fontawesome'


const app = createApp(App)
const pinia = createPinia()


app.use(pinia)   
app.use(router)  


app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
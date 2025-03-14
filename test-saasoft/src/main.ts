import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi'
    },
})

app.config.errorHandler = (err: unknown, vm, info) => {
  if (err instanceof Error) {
    if (err.message.includes('Cannot read properties of undefined')) {
      return
    }
    console.error(err)
  } else {
    console.error('Unknown error', err)
  }
}

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')

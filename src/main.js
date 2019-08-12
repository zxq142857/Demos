import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './registerServiceWorker'
import 'animate.css'
import $ from 'jquery'
import Tools from './assets/js/tools'
Vue.prototype.$jQuery = $
Vue.prototype.$Tools = Tools
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

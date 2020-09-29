import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import "./assets/css/global.css"
import "./assets/fonts/iconfont.css"
import axios from "axios"
// 设置下请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
    // 把axios挂载到vue的实例，，每个vue组件都可以通过this访问到http
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
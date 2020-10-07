import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import "./assets/css/global.css"
//引入第三方字体图标库
import "./assets/fonts/iconfont.css"
import axios from "axios"
// 设置下请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
    //在把请求挂载到Vue之前设置一个拦截器,目的是需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌
axios.interceptors.request.use(config => {
        console.log(config);
        config.headers.Authorization = window.sessionStorage.getItem("token")
            // 最后必须returnconfig
        return config
    })
    // 把axios挂载到vue的实例，，每个vue组件都可以通过this访问到http
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
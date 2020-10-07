import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Welcome from "../components/Welcome.vue"
import Users from "../components/user/Users.vue"

Vue.use(VueRouter)

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
        path: "/home",
        component: Home,
        redirect: "/welcome",
        children: [{
                path: "/welcome",
                component: Welcome
            },
            {
                path: "/users",
                component: Users
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

// 挂载路由导航
router.beforeEach((to, from, next) => {
    //如果访问的路径是login登陆页面直接放行
    if (to.path === "/login") return next()
        //如果是其他的页面那就获取token如果获取不到强制跳转到login页面
    const tokenStr = window.sessionStorage.getItem("token")
        //如果当前页面没有token就强制跳转到login
    if (!tokenStr) return next("/login")
        //如果有就直接放行
    next()
})
export default router
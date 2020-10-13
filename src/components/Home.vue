<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 主题区域 -->
    <el-container>
      <!-- 侧边栏菜单 -->
      <el-aside width="200px">
        <div class="toggle-btn">| | |</div>
        <el-menu
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          router
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
           <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </template>
           </el-menu-item>
          </el-submenu>
         
        </el-menu>
      </el-aside>
      <!-- main信息 子组件 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      menuList:[],
      iconObj:{
      125:"iconfont icon-user",
      103:"iconfont icon-tijikongjian",
      101:"iconfont icon-shangpin",
      102:"iconfont icon-danju",
      145:"iconfont icon-baobiao"
    }
    }
    
    
  },
  // 声明周期函数，，创建这个组件时就调用这个
  created(){
 this.getMenuList()
  },
  methods: {
    exit() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取所有的菜单数据
   async getMenuList(){
     
     const {data:res} =  await this.$axios.get("menus")
    //  console.log(res);
     if(res.meta.status!==200) return this.$message.error(res.meta.msg)
     this.menuList=res.data
    }
  },
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  img {
    width: 60px;
    height: 60px;
  }
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-menu{
  border-right: 0;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-btn{
  background-color: #4A5064;
  color:#fff;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  cursor: pointer;
  
}
</style>
<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
        <!-- 搜索与添加区域 -->
        <el-row :gutter="20">

        <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
        
        </el-col>
        <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
        
        </el-row>
        <!-- 用户列表区域 -->
        <el-table :data="userlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username"" label="姓名"></el-table-column>
                <el-table-column prop="email"" label="邮箱" ></el-table-column>
                <el-table-column prop="mobile"" label="电话"></el-table-column>
                <el-table-column prop="role_name"" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <!-- slot-scope 是插槽获取mg_state的true或者false值来定义开关 -->
                    <template slot-scope="scope">
                        <!-- {{scope.row}}  scope.row可以获取到所有响应数据 -->
                        <el-switch
                        v-model="scope.row.mg_state"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                         @change="userStateChang(scope.row)"
                        >
                       
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                     <template slot-scope="scope">
                          <!-- 编辑按钮 -->
                         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialogBtns(scope.row.id)"></el-button>
                         <!-- 删除按钮 -->
                         <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                         <!-- 分配角色按钮 -->
                         <el-tooltip effect="dark" content="分配角色" placement="top-end" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                         
                     </template>
                </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1,2,5,10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"     
            :total="total">
        </el-pagination>
    </el-card>

    <!-- 添加用户区域 -->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addFormClose"
        >
       <!-- 内容主题区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserBtns">确 定</el-button>
  </span>
    </el-dialog>
<!-- 修改用户区域 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%"
  >
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" @close="editDialogClosed">
    <el-form-item label="用户名">
      <el-input v-model="editForm.username" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="editForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="editForm.mobile"></el-input>
    </el-form-item>
    </el-form>
    
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormInfo">确 定</el-button>
  </span>
</el-dialog>

    </div>  
</template>

<script>
export default {
  data() {
    // 自定义验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      //  验证邮箱的正则表达式
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确邮箱'))
    }
    // 自定义验证手机号规则
    var checkMoblie = (rule, value, cb) => {
      //  验证手机号的正则表达式
      const regMobile = /^(0|86||17951|)?(13[0-9]|15[0123456789]|18[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确手机号'))
    }

    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      //   控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      //   添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名额长度在3~10个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名额长度在3~10个字符之间',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMoblie, trigger: 'blur' },
        ],
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {},

      // 修改表单的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMoblie, trigger: 'blur' },
        ],
      },
    }
  },
  //   user组件创建后就调用
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$Message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码之值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch 开关状态的改变
    async userStateChang(userinfo) {
      //   console.log(userinfo)
      const { data: res } = await this.$axios.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      //   console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_statu = !userinfo.mg_statu
        return this.$message.error('用户更新状态失败')
      }
      this.$message.success('用户状态更新成功')
    },
    // 添加用户重置初始
    addFormClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户  用户表单预验证/validate有个参数vali 验证通过就返回true不通过就false
    addUserBtns() {
      this.$refs.addFormRef.validate(async (vali) => {
        // console.log(vali);
        if (!vali) return
        const { data: res } = await this.$axios.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('用户添加失败')
        }
        this.$message.success('添加用户成功')
        //  添加成功后关闭对话框
        this.addDialogVisible = false
        //  重新获取用户的列表数据6
        this.getUserList()
      })
    },
    // 展示编辑用户对话框

    async showEditDialogBtns(id) {
      // console.log(id);
      const { data: res } = await this.$axios.get('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }

      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editFormInfo() {
      this.$refs.editFormRef.validate(async (vali) => {
        if (!vali) return
        //  发送修改用户信息的数据请求
        const { data: res } = await this.$axios.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }

        //   开发中修改更新都会有这三个操作
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },

    // 根据id删除对应的用户
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResilt = await this.$confirm(
        '此操作将永久删除该用户信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err=>err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回为字符串 cancel
      // console.log(confirmResilt);
      if (confirmResilt !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      
      const { data: res } = await this.$axios.delete('users/' + id)

      if(res.meta.status !==200){
        return this.$message.error("删除用户失败")
      }

      this.$message.success("删除用户成功")
      this.getUserList()
      
    },
  },
}
</script>

<style lang="less" scoped>
</style>
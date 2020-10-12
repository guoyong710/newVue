<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList">
        <!-- 展开列 通过作用域插槽 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="romoveRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="romoveRightById(scope.row, item2.id)"
                    >
                      {{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      @close="romoveRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 序号列 -->
        <el-table-column type="index" prop="date" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户区域 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addRolesClose"
    >
      <!-- 内容主图区域 -->
      <el-form
        :model="addRoles"
        ref="addRolesRef"
        label-width="80px"
        :rules="addRolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户区域 -->
    <el-dialog
      title="添加角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editRolesClose"
    >
      <!-- 内容主图区域 -->
      <el-form
        :model="editRoles"
        ref="editRolesRef"
        label-width="80px"
        :rules="editRolesRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetRightDialogVisble"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- tree属性解构控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeFef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 添加用户弹出框的显示与隐藏
      addDialogVisible: false,

      //添加角色信息数据
      addRoles: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色验证
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '用户角色额长度在2~5个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名额长度在3~10个字符之间',
            trigger: 'blur',
          },
        ],
      },
      // 修改用户角色验证
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '用户角色额长度在2~5个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名额长度在3~10个字符之间',
            trigger: 'blur',
          },
        ],
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      editRoles: {},
      // 控制分配权限的对话框显示与隐藏
      showSetRightDialogVisble: false,
      // 所有权限的数据
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认勾选的节点的id值
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$axios.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }

      this.roleList = res.data

      //   console.log(this.roleList)
    },
    // 添加角色重置
    addRolesClose() {
      this.$refs.addRolesRef.resetFields()
    },
    // 点击按钮添加新用户
    addRolesInfo() {
      this.$refs.addRolesRef.validate(async (vali) => {
        if (!vali) {
          return
        }

        const { data: res } = await this.$axios.post('roles', this.addRoles)

        //    console.log(res);
        // 关闭对话框
        this.addDialogVisible = false
        // 更新角色列表数据
        this.getRolesList()
        // 提示添加成功
        this.$message.success('角色添加成功')
      })
    },
    // 对话框取消后重置
    editRolesClose() {
      this.$refs.editRolesRef.resetFields()
    },
    // 展示用户编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get('roles/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询用户角色失败')
      }
      this.editRoles = res.data

      this.editDialogVisible = true
    },
    //    修改角色信息并提交
    editFormInfo() {
      this.$refs.editRolesRef.validate(async (vali) => {
        if (!vali) return
        // 发送修改角色信息的数据请求
        const { data: res } = await this.$axios.put(
          'roles/' + this.editRoles.roleId,
          {
            roleName: this.editRoles.roleName,
            roleDesc: this.editRoles.roleDesc,
          }
        )
        //   console.log(res);
        //    console.log(this.editRoles.id);

        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        //   刷新数据列表
        this.getRolesList()
        // 提示修改成功
        this.$message.success('更新角色信息成功')
      })
    },
    //    根据id删除对应的角色
    async removeRolesById(id) {
      // 弹框询问用户是否删除数据
      const confirmResilt = await this.$confirm(
        '此操作将永久删除该用户信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回为字符串 cancel
      // console.log(confirmResilt);
      if (confirmResilt !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$axios.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }

      this.$message.success('删除角色成功')
      this.getRolesList()
    },

    // 根据id删除对应的权限
    async romoveRightById(role, rightId) {
      // console.log(roleId);
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }

      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }

      this.$message.success('删除权限成功')
      // 这样删除一个权限会刷新整个列表，会把展开列关闭掉不想这样，，只想刷新权限
      // this.getRolesList()
      // 只想刷新权限 让展开列不会关闭掉，就是重新给role赋值，
      role.children = res.data
    },
    //展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$axios.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }

      this.rightsList = res.data
      // console.log(this.rightsList)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.showSetRightDialogVisble = true
    },

    // 通过递归的形式 获取角色下所有三级权限的id，，
    // 并保存到defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含children 属性，则就是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      // 解决刷新这个列表数据
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeFef.getCheckedKeys(),
        ...this.$refs.treeFef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')

      const {
        data: res,
      } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')

      this.getRolesList()

      this.showSetRightDialogVisble = false
    },
  },
}
</script>
<style lang="less" scoped>
.el-row {
  margin-top: 20px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
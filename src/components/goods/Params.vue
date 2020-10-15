<template>
    <div>   
        <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
    <!-- 警告区域 -->
    <el-alert
    title="注意：只允许为第三级分类设置相关参数"
    type="warning"
    :closable="false"
    show-icon>
    </el-alert>  
    <!-- 选择商品分类区域 -->
    <el-row class="cat_opt">
        <el-col>
            <span>选择商品分类：</span>    
             <!-- 商品分类级联选择器 -->
             <el-cascader
             v-model="selectedCateKyes"
             :options="paramsList"
             :props="cateProps"
             @change="handleChange">
             </el-cascader>
        </el-col>
        
    </el-row>
    
    <!-- tabs 标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many">
        <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addDialogVisible=true">添加参数</el-button>
       <!-- 动态参数表格 -->
        <el-table
      :data="manyTabData"
      style="width: 100%"
      border
      stripe>
      <!-- 展开列 -->
      <el-table-column
        type="expand"
        width="180">
         <el-table-column
        type="expand"
        width="180">
        <!-- 循环渲染tag标签 -->
        <template slot-scope="scope">
            <el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
            
        <!-- 按钮与文本框切换 -->
        <el-input
        class="input-new-tag"
        v-if="scope.row.inputVisible"
        v-model="scope.row.inputValue"
        ref="saveTagInputRef"
        size="small"
        @keyup.enter.native="handleInputConfirm(scope.row)"
        @blur="handleInputConfirm(scope.row)"
        >
        </el-input>
        
        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
      </el-table-column>
      </el-table-column>
      <!-- 序号 -->
       <el-table-column
        type="index"
        label="序号"
        width="180">
      </el-table-column>
      <!-- 参数名称 -->
      <el-table-column
        prop="attr_name"
        label="参数名称"
        width="180">
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
        </template>
      </el-table-column>
        </el-table>
    </el-tab-pane>
    <!--添加静态属性的面板 -->
    <el-tab-pane label="静态属性" name="only">
        <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addDialogVisible=true">添加属性</el-button>
        <!-- 静态属性表格 -->
        <el-table
      :data="onlyTaData"
      style="width: 100%"
      border
      stripe>
      <!-- 展开列 -->
      <el-table-column
        type="expand"
        width="180">
        <!-- 循环渲染tag标签 -->
        <template slot-scope="scope">
            <el-tag :key="i" v-for="(item,i) in scope.row.attr_vals" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
            
        <!-- 按钮与文本框切换 -->
        <el-input
        class="input-new-tag"
        v-if="scope.row.inputVisible"
        v-model="scope.row.inputValue"
        ref="saveTagInputRef"
        size="small"
        @keyup.enter.native="handleInputConfirm(scope.row)"
        @blur="handleInputConfirm(scope.row)"
        >
        </el-input>
        
        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
      </el-table-column>
      <!-- 序号 -->
       <el-table-column
        type="index"
        label="序号"
        width="180">
      </el-table-column>
      <!-- 参数名称 -->
      <el-table-column
        prop="attr_name"
        label="属性名称"
        width="180">
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.attr_id)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
        </template>
      </el-table-column>
        </el-table>
    </el-tab-pane>
    </el-tabs>
    </el-card>
    <!-- 添加动态参数和静态属性共用一个的对话框 -->
   <el-dialog
  :title="'添加'+ titleText"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed"
  >
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!--修改参数的对话框 -->
<el-dialog
  :title="'添加'+ titleText"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClose"

  >
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="editForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams()">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类数据列表
      paramsList: [],
      //级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 级联选择框双向绑定的数组
      selectedCateKyes: [],
      // 被激活的页签
      activeName: 'many',
      //动态参数的数据
      manyTabData: [],
      //静态属性的数据
      onlyTaData: [],
      // 控制添加动态参数与静态属性的对话框显示与隐藏
      addDialogVisible: false,
      // 添加分类参数的数据对象
      addForm: {
        attr_name: '',
      },
      // 添加表单的验证规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
      //  控制修改参数的对话框的显示与隐藏
      editDialogVisible: false,
      // 修改分类参数的数据对象
      editForm: {
        attr_name: '',
      },
      // 修改分类参数表单验证规则
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getParamsList()
  },
  methods: {
    // 获取商品分类列表数据
    async getParamsList() {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.paramsList = res.data
      //   console.log(this.paramsList)
    },
    // 级联选择框变化,会触发这个事件
    async handleChange() {
      //   console.log(this.selectedCateKyes)
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      // console.log(this.activeName);

      this.getParamsData()
    },
    //获取参数的列表数据
    async getParamsData() {
      // 根据所选的分类id，和当前所处的面板获取对应的参数
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('请填写商品分类')
      }
      // 把数据的attr_vals的数据转换为数组，，渲染到展开列里去
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
        // console.log(item.attr_vals);
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTaData = res.data
      }
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击确定进行预验证发送添加动态和静态属性
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 监听编辑对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    //监听对话框的显示与隐藏
    async showEditDialog(attr_id) {
      const { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editForm = res.data
      //   console.log(res.data)
      this.editDialogVisible = true
    },
    //编辑完成后提交参数
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('参数修改失败')
        }

        this.$message.success('参数修改成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    //点击删除按钮删除参数
    async removeParams(attr_id) {
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
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$axios.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    //文本失去焦点和抬起enter建会触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      // 如果没有return ，则证明输入的内容需要后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      // 发送请求，保存这次操作
        this.saveAttrVals(row)
    },
    //点击 按钮 触发 展示 input文本框
    showInput(row) {
      row.inputVisible = true
      // $nextTick 方法的作用，就是当页面上的元素被重新渲染后，才会指定回调函数中的代码

      this.$nextTick((_) => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    //删除对应的参数可选项
    handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrVals(row)
    },
    // 将堆attr_vals 的操作保存到数据库
   async saveAttrVals(row){
         const {data:res} =  await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' '),
      })
    //   console.log(row)
    if(res.meta.status !== 200){
        this.$message.error("修改参数项失败")
    }
    this.$message.success("修改参数项成功")
    },
    },
  
  computed: {
    // 如果按钮需要被禁用则返回true,否则返回false
    isBtnDisabled() {
      // 当selectedCateKyes级联选择器的值为空时,返回true,否则false
      if (!this.selectedCateKyes.length) {
        return true
      }
      return false
    },
    //当前选中的三级分类的id
    cateId() {
      if (this.selectedCateKyes.length) {
        return this.selectedCateKyes[2]
      }

      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.input-new-tag {
  width: 150px;
}
</style>
<template>
    <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
    <!-- 表格 -->
    <tree-table
    :data="cateList"
    :columns="columns"
    show-index
    border
    :selection-type="false"
    :expand-type="false"
    class="treeTable"
    >
    <!-- 是否有效列 -->
    <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted ===false"
        style="color:lightgreen"></i>
        <i class="el-icon-error" v-else style="color:red"></i>
    </template>
    <!-- 排序列 -->
    <template slot="order" slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.cat_level ===1">二级</el-tag>
            <el-tag type="danger" v-else>三级</el-tag>
    </template>
    <!-- 操作 -->
    <template slot="opt" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showInfoCateBtns(scope.row.cat_id)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCateBtns(scope.row.cat_id)">删除</el-button>
    </template>
    </tree-table>
    <!-- 分页 -->
<!-- handleSizeChang事件函数是页面显示多少条数据,改变后立马赋值给数据pagesize 
        handleCurrentChange 4事件是当前页码值发生了变化p=后赋值给pagenum-->
    <el-pagination
    
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
        </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  width="50%">
    <!-- 添加分类的表单 -->
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类:">
      <!-- options用来指定数据源 -->
      <!-- props 用来指定配置对象 -->
   <el-cascader
     clearable
     change-on-select
    :options="parentCateList"
    :props="cascaderProps"
    v-model="selectedKeys"
    @change="parentCatehange">
    </el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
  title="提示"
  :visible.sync="editdialogVisible"
  width="50%"
>
 <el-form ref="editformRef" :model="editform" label-width="80px" :rules="editFormRules">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editform.cat_name"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormInfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表,,默认为空
      cateList: [],
      // 总页数
      total: 0,

      // 树形table每列的信息,每一列是个对象
      columns: [
        // 第一列的数据渲染
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        // 第二列的数据渲染
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用模板名称
          template: 'isok',
        },
        // 第三列的数据渲染
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用模板名称
          template: 'order',
        },
        //第四列的数据渲染
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用模板名称
          template: 'opt',
        },
      ],
      // 控制添加分类的对话框显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级默认添加的一级分类
        cat_level: 0,
      },
      //添加分类表单的规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示与隐藏
      editdialogVisible: false,
      //获取的修改表单的 数据
      editform: {},
      //   编辑分类表单的规则对象
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryInfo,
      })
      //   console.log(res.data);

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize 改变
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      // pageSize改变了 重新获取下数据
      this.getCateList()
    },
    // 监听pagenum 改变
    handleCurrentChange(newNum) {
      // console.log(newNum);
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击按钮 展示 添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的列表数据
      this.getParentCateList()
      //    在展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$axios.get('categories', {
        params: { type: 2 },
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }

      this.parentCateList = res.data
      //   console.log(this.parentCateList)
    },
    // 选择项发生变化出发这个函数
    parentCatehange() {
      console.log(this.selectedKeys)
      // 如果selectKeys 数组中的length 大于0 证明选中的父级分类
      // 反之,就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          (this, selectedKeys.length - 1)
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 分类父级的id
        this.addCateForm.cat_pid = 0

        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate() {
      console.log(this.addCateForm)
    },
    //展示编辑按钮的 信息
    async showInfoCateBtns(id) {
      //   console.log(id)
      const { data: res } = await this.$axios.get('categories/' + id)
      // console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类失败')
      }
      this.editform = res.data

      this.editdialogVisible = true
    },
    // 修改编辑数据 并提交
    editFormInfo() {
      this.$refs.editformRef.validate(async (vali) => {
        if (!vali) {
          return
        }
        const { data: res } = await this.$axios.put(
          'categories/' + this.editform.cat_id,
          {
            cat_name: this.editform.cat_name,
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('修改分类名称失败')
        }
        this.editdialogVisible = false
        this.$message.success('修改分类名称成功')
        // console.log(res.data);
        this.reload()
        // this.getCateList()
        // this.editform.cat_name = res.data
      })
    },
    // 根据分类id删除分类
    async deleteCateBtns(id) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }

      const { data: res } = await this.$axios.delete('categories/' + id)
     if (res.meta.status !== 200) {
          this.$message.error('删除分类失败')
        }
     this.$message.success("删除分类成功")
     this.reload()
     },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
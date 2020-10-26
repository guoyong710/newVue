<template>
    <div>
         <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 卡片视图区域 -->
    <el-card>
        <el-row :gutter=20>
            <el-col :span="8">
                  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
        </el-input>
            </el-col>
            <el-col :span='6'>
                <el-button  type="primary" @click="addGoods">添加商品</el-button>
            </el-col>
            
        </el-row>

        <!-- 商品数据表格 -->
        <el-table border stripe
      :data="goods_list"
      style="width: 100%">
      <el-table-column
        type='index'
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        >
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
       width="95">
      </el-table-column>
       <el-table-column
        prop="goods_weight"
        label="商品重量"
       width="70">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间"
       width="140">
       <template slot-scope="scope">
           {{scope.row.add_time | dataFormat}}
       </template>
      </el-table-column>
      <el-table-column
        label='操作'
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini'>编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeGoodsById(scope.row.goods_id)">删除</el-button>
        </template>
      </el-table-column>
        </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"

      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      //查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //商品列表数据对象
      goods_list: [],
      //总商品条数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    //获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$axios.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      // console.log(res.data);
      this.goods_list = res.data.goods
      this.total = res.data.total
      // console.log(this.goods_list);
    },
    //根据分页获取对应的商品列表
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
      //   console.log(newSize);
    },
    //点击按钮删除对应的商品
    async removeGoodsById(id) {
      const confirmResule = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResule !== 'confirm') {
        return this.$message.error('已经取消删除')
      }
      const { data: res } = await this.$axios.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        return $message.error('删除商品失败')
      }
     
      this.getGoodsList()
    },
    //点击添加商品按钮进入添加商品页
    addGoods(){
        this.$router.push('/add')
    }
  },
}
</script>

<style lang="less" scoped>
</style>
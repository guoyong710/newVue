<template>
    <div>
         <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
       <el-row>
           <el-col :span='8'>
                <el-input placeholder="请输入内容">
                 <el-button slot="append" icon="el-icon-search"></el-button>
         </el-input>
           </el-col>
       </el-row>

       <!-- table表格 -->
       <el-table
      :data="orderList"
      style="width: 100%"
      border
      stripe>
      <el-table-column
        type="index"
        label="#"
        width="80"
        >
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编码"
        width="200">
      </el-table-column>
       <el-table-column
        prop="order_price"
        label="订单价格"
        width="120">
      </el-table-column>
       <el-table-column
        
        label="是否付款"
        width="150">
        <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status ==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="150">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间"
        width="180">
        <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
        </template>
      </el-table-column>
      <el-table-column
        
        label="操作"
        width="180">
        <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location"  size='mini' @click="showProgressBox"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 15, 20, 25]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 点击编辑按钮弹出对话框 -->
    <el-dialog
    title="提示"
    :visible.sync="addressDialogVisible"
    width="50%"
    @close="addressDialogClosed"
    >
    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
    <el-form-item label="省市区/县" prop="address1">
    <el-cascader
    v-model="addressForm.address1"
    :options="cityData"
    
    >
    </el-cascader>

     </el-form-item>
     <el-form-item label="详细地址" prop="address2">
    <el-input v-model="addressForm.address2"></el-input>
     </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
    <!--物流进度对话框 -->
    <el-dialog
  title="物流进度"
  :visible.sync="processDialogVisible"
  width="50%"
 >
 <!-- 物流时间线 -->
 <!-- <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline> -->
  
</el-dialog>
    </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //订单列表数据
      orderList: [],
      //总页数
      total: 0,
      // 编辑对话框的显示与隐藏
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      //各种城市信息
      cityData: cityData,
      // 物流进度对话框的显示与隐藏
      processDialogVisible: false,

      //物流信息数据
      progressInfo: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取订单列表
    async getOrderList() {
      const { data: res } = await this.$axios.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }

      this.$message.success('获取订单列表成功')
      this.orderList = res.data.goods
      this.total = res.data.total
    //   console.log(this.orderList)
    },

    //分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    //展示修改地址的对话框
    showBox() {
      this.addressDialogVisible = true
    },
    //当对话框关闭重置表单
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    //点击按钮查看物流信息
    async showProgressBox() {
        //有问题 显示没有这个对应的公司
    //   const { data: res } = await this.$axios.get("/kuaidi/"+804909574412544580)
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('获取物流信息失败')
    //   }

    //   this.progressInfo = res.data
    //   console.log(this.progressInfo);
    //   this.processDialogVisible = true
    },
  },
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
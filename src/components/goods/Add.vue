<template>
    <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 消息提示 -->
     <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closable=false>
  </el-alert>
  <!-- 步骤条 -->
  <el-steps :space="200" :active="Number(activeIndex)" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
    <!-- tab标签页   表单需要包住tabs，
    因为他们所有的el-tab-pane 才是一个完整的商品信息-->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position='top'>
     <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name='0'>
        <el-form-item label='商品名称' prop='goods_name'>
            <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(必须为数字)" prop='goods_price'>
            <el-input v-model="addForm.goods_price"></el-input type="number">
        </el-form-item>
        <el-form-item label='商品重量' prop='goods_weight'>
            <el-input v-model="addForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label='商品数量' prop='goods_number'>
            <el-input v-model="addForm.goods_number"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label='商品分类' prop='goods_cat'>
           <el-cascader
            v-model="addForm.goods_cat"
            :options="CateList"
            :props="cateProps"
            @change="handleChange"
            ></el-cascader>
        </el-form-item>
        
    </el-tab-pane>
    <!-- 动态参数 -->
    <el-tab-pane label="商品参数" name='1'>
        <!-- 渲染item项 -->
        <el-form-item :label='item.attr_name' v-for="item in manyTabData" :key="item.attr_id">
             <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox border :key="i" :label="cb" v-for="(cb,i) in item.attr_vals"></el-checkbox>

        </el-checkbox-group>
      </el-form-item>

        
    </el-tab-pane>
    <el-tab-pane label="商品属性" name='2'>
        <el-form-item :label='item.attr_name' v-for="item in onlyTabData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name='3'>
        <!--点击上传图片action是必选参数，，必须是完整的地址 -->
        <el-upload
        :action="uploadImg"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        list-type="picture"
        :headers='requstHeaders'
        :on-success='handleSuccess'>
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name='4'>
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type='primary' class="addBtn" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
    </el-form>
    </el-card>
    <!-- 预览图片的对话框 -->
    <el-dialog
  title="图片预览"
  :visible.sync="previewVisibel"
  width="50%"
  >
  <img :src="previewPath" alt="" class="previewImg">
  
</el-dialog>
    </div>
</template>
<script>
// lodash库推荐用下划线命名,,就像jquery推荐用$命名jqury一样
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      //添加表单对象数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },

      //表单验证
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // 商品列表数据
      CateList: [],
      //级联选择器
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      //动态参数列表数据
      manyTabData: [],
      // 静态属性列表数据
      onlyTabData: [],
      //图片上传的完整地址
      uploadImg: 'http://127.0.0.1:8888/api/private/v1/upload',
      //因为图片上传并没有用axios，所以没有token的请求头，重新设置请求头字段
      requstHeaders: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //点击图片预览图片
      previewPath: '',
      //控制图片预览对话框
      previewVisibel: false,
    }
  },
  created() {
    this.getCateLsit()
  },
  methods: {
    async getCateLsit() {
      const { data: res } = await this.$axios.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取列表数据失败')
      }
      //   console.log(res.data)

      this.CateList = res.data
    },
    //级联选择器选择项变化会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log("即将进入的标签页名字是" + activeName,"即将离开的标签页的名字是"+oldActiveName);
      if (!this.addForm.goods_cat.length) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //点击各个tabs发送请求
    async tabClicked() {
      //证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        const {
          data: res,
        } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' },
        })

        //  console.log(res.data);
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }

        //把返回的attr_vals的字符串转换为数组
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        console.log(res.data)
        this.manyTabData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' },
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取静态属性失败')
        }
        this.onlyTabData = res.data
        console.log(this.onlyTabData)
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisibel = true
      console.log(this.previewPath)
    },
    //移除图片的操作
    handleRemove(file) {
      //1.获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path

      // 2.从pics 数组中, 找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath
      })
      // 3.调用数组的splice 方法,把图片信息对象,从pics数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      // 1.因为请求参数要一个数组里边包含每个图片的对象，先拼接得到一个图片信息对象
      const pivInfo = { pic: response.data.tmp_path }
      // 2.将图片信息对象push到pics数组中
      this.addForm.pics.push(pivInfo)
      // console.log(this.addForm.pics);
    },
    //点击按钮进行表单预验证,,添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项')

        // 执行添加商品的业务逻辑   (有个问题就是,级联选择器v-model返回的是数组,
        // ,请求接口要的是以逗号分隔的字符串,,我们直接用join转为字符串会报错,因为我们操作了级联选择器的那个数组,
        // 所以因为这个报错,,解决,,用深拷贝重新拷贝一份addFrom,,
        // 这样this.addForm 只给那些级联选择器,其他元素使用,,而深拷贝出来的这个转换使用)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        //动态参数处理
        this.manyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        //静态参数处理
        this.onlyTabData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }

          this.addForm.attrs.push(newInfo)
        })
        //最终要想服务器提交的是这个form不是addFrom
        form.attrs = this.addForm.attrs
        console.log(form)

        //发起请求添加商品
        //注意商品的名称必须是唯一的 .注意发送请求的是from不是addform
        const { data: res } = await this.$axios.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    //获取三级分类的id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
    },
  },
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
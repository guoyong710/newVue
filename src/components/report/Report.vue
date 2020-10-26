<template>
    <div>
         <!-- 面包屑导航 -->
    <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</a></el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
         <!--2. 为ECharts准备一个具备大小（宽高）的Dom -->
         <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
    </div>
</template>

<script>
// 1.导入 echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      opthions: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#9eef3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [{ boundaryGap: false }],
        yAxis: [{ type: 'value' }],
      },
    }
  },
  //这个是组件实例完成后执行
  created() {},

  //此时页面上的元素,已经被渲染完毕  这个钩子函数是当dom元素渲染完成后会执行
  async mounted() {
    // 3.基于准备好的dom,通过init初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$axios.get('reports/type/1')

    if (res.meta.status !== 200) {
      return this.$message.error('获取数据失败')
    }
    // 4.准备数据和配置项   通过lodash的merge方法合并了两个对象
    const result = _.merge(res.data, this.opthions)
    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {},
}
</script>

<style lang="less" scoped>
</style>
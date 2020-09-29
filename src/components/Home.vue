<template>
  <el-button type="info" @click="exit">退出</el-button>
</template>

<script>
export default {
  methods: {
    exit() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped>
</style>>
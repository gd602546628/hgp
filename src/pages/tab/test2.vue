<template>
  <zyt-page>
    <div slot="main">
      <div v-for="(item,i) in new Array(100)">{{i}} test</div>
        <p @click="goDemo()">跳转Demo页</p>
      <div v-for="(item,i) in new Array(100)">{{i}} test</div>
    </div>
  </zyt-page>
</template>
<script>
  export default {
    methods: {
      goDemo () {
        this.$router.push('/index')
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped></style>

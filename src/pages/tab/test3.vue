<template>
  <zyt-page :hasHeader="true" :hasFooter="true">
    <div slot="header">
      <mt-header title="multiple button">
        <router-link to="/" slot="left">
          <mt-button icon="back">back</mt-button>
        </router-link>
        <mt-button icon="more" slot="right"></mt-button>
      </mt-header>
    </div>
    <div slot="main">
      <div v-for="(item,i) in new Array(100)">{{i}} test</div>
        <p @click="goDemo()">跳转Demo页</p>
      <div v-for="(item,i) in new Array(100)">{{i}} test</div>
    </div>
    <div slot="footer">测试测试</div>
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

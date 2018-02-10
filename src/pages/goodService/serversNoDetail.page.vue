<template>
  <zyt-page :hasHeader="true">
    <mt-header title="本地服务" slot="header">
      <mt-button slot="left" icon="back" @click="handleBack"></mt-button>
    </mt-header>
    <div slot="main">
      <div class="serversDel-img">
        <img src="../../assets/img/serviceCgy/delete.png">
      </div>
      <div class="serversDel-prompt">
        <span>该内容已被删除，您可以看看其他信息</span>
      </div>
    </div>
  </zyt-page>
</template>
<script>
  export default{
    name: 'serversNoDetail',
    data(){
      return {}
    },
    methods: {
      handleBack(){
        this.$router.go(-1)
      }
    },
    created(){
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
.serversDel-img{
  margin-top: 20px;
  img{
    width: 100%;
    vertical-align: middle;
  }
}
.serversDel-prompt {
  border: none;
  padding: 20px;
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
}
</style>

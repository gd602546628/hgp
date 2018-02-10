<template>
  <div :class="isGoodLife?'noDataTop':'noData'">
    <img src="../../assets/img/empty.png" class="img">
    <p>暂无相关数据</p>
    <img src="../../assets/img/SYin.png" class="water">
  </div>
</template>
<script>
  export default{
    props: {
      'isGoodLife': {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .noData {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -65px;
    margin-top: -73px;
    .img {
      width: 60px;
    }
    .water {
      width: 130px;
    }
  }
  .noDataTop{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 70px 0px;
    .img {
      width: 60px;
    }
    .water {
      width: 130px;
    }
  }
</style>

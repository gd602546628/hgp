<template>
  <div>
    <p style="margin-top: 40px">store数据响应</p>
    <div>{{test}}</div>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default{
    computed: {
      ...mapState(['test'])
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped></style>

/**
* Created by guooug on 2017/6/16.
*/

<template lang="html">
  <div class="container" v-if="isShow" @click="close()">
    <div></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isShow: false
      }
    },
    watch: {
      'route': 'close'
    },
    destroy(){
      console.info('destroydestroydestroy')
    },
    methods: {
      show(){
        this.isShow = true
      },
      close(){
        this.isShow = false
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .container {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    div {
      position: absolute;
      height: 100%;
      width: 100%;
      background-image: url("../../assets/img/share/shareTip.png");
      background-repeat: no-repeat;
      background-size: 80% auto;
      background-position: right top;
    }
    &:after {
      position: absolute;
      z-index: -1;
      background-color: black;
      opacity: .3;
      content: '';
      display: block;
      height: 100%;
      width: 100%;
    }
  }
</style>

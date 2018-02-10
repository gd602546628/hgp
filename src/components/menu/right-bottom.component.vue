<template lang="html">
  <div class="container activity-switch-style" :class="{show:show}">
    <div class="bg" ref="bg"></div>
    <div class="main" ref="main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      currentTop: {
        type: Number,
        default: 0
      }
    },
    data(){
      return {
        opacityHeight: 200,
        bottom: 0,
        show: true
      }
    },
    watch: {
      'currentTop': 'onScroll'
    },
    methods: {
      onScroll(scrollTop){
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .container {
    transition: all .1s cubic-bezier(.55, 0, .1, 1);
    border-radius: 50%;
    /*overflow: hidden;*/
    position: fixed;
    width: 46px;
    height: 46px;
    right: 4px;
    bottom: 30px;
    z-index: 10;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    padding: 0px;
/*    pointer-events: none; */
    justify-content: center;
    align-items: center;
    display: none;
    &.show {
      display:  -webkit-flex;
    }
    .main {
      display: flex;
      padding: 0px;
      justify-content: center;
      align-items: center;
    }
    .bg {
      transition: all .1s cubic-bezier(.55, 0, .1, 1);
      background-color: black;
      opacity: .6;
      position: absolute;
      right: 0px;
      height: 100%;
      width: 100%;
      border-radius: 50%;
      /*  display: -webkit-flex;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        display: flex;
        justify-content: center;
        align-items: center;*/
      z-index: -1;
    }
  }

</style>

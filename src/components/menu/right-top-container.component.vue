/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="container" :class="{show:show}">
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
        top: 40,
        show: false
      }
    },
    watch: {
      'currentTop': 'onScroll'
    },
    methods: {
      onScroll(scrollTop){
        /*  if (scrollTop > this.top) {
         this.$el.classList.add('show')
         } else {
         this.$el.classList.remove('show')
         } */
        this.show = scrollTop > this.top
        /*    let opacity = (scrollTop - 50) / this.opacityHeight / 5
         this.$refs.main.style.opacity = opacity
         opacity = opacity > 0.6 ? 0.6 : opacity
         this.$refs.bg.style.opacity = opacity */
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
    top: 4px;
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

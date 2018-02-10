/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <div class="container" ref="wrap" @click="click()">
    <div class="content" :class="className" ref="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="babel">
  export default {
    props: {
      top: {
        type: Number,
        default: 0
      }
    },
    computed: {
      className(){
        if (this.top && this.$el) {
          let y = this.top - this.$el.offsetTop
          if (y > 0) {
            return {
              fixed: true
            }
          }
        }
        return {}
      }
    },
    mounted(){
      let height = this.$refs.content.offsetHeight
      this.$el.style.height = `${height}px`
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .container {
    .content {
      position: relative;
    }
    .fixed {
      position: fixed;
      top: 0px;
      z-index: 100;
    }
  }
</style>


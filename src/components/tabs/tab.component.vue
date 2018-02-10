/**
* Created by guooug on 2017/6/16.
*/
<template lang="html">
  <transition :name='actionName'>
    <div ref="tab" class="tab" :class="platform" v-show="data.active" v-if="init">
      <component :is="data.component"></component>
    </div>
  </transition>
</template>

<script lang="babel">
  import Util from '@/service/common/utils/util.service'
  export default {
    props: {
      data: {
        /**
         *    title: 标题
         *    component: 页面
         *    icon: 图标名称，字体图标
         *    activeIcon: 激活时的字体图标
         *    active: true 是否是激活状态
         *    params: {} 传给组件的参数，会将params 传给component prop中
         */
        type: Object,
        require: true
      }
    },
    watch: {
      data: {
        handler(val){
          this.init = this.init || val.active
        },
        deep: true
      }
    },
    computed: {
      actionName(){
        return this.data.actionName || ''
      },
      platform(){
        return {
          android: Util.browser.versions.android,
          ios: Util.browser.versions.ios
        }
      }
    },
    data(){
      return {
        // 用于判断是否已经初始化过组件
        init: this.data.active
      }
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type='text/scss' scoped>
  .ios, .android {
    transition: all .25s cubic-bezier(.55, 0, .1, 1);
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .ios {
    &.left-enter,
    &.right-leave-to {
      -webkit-transform: translate(100%);
      transform: translate(100%);
    }
    &.right-enter,
    &.left-leave-to {
      -webkit-transform: translate(-100%);
      transform: translate(-100%);
    }
  }

  .android {
    &.left-enter,
    &.right-leave-to {
      z-index: 2;
      opacity: 0;
      -webkit-transform: translate(320px);
      transform: translate(320px);
    }
    &.right-enter,
    &.left-leave-to {
      z-index: 2;
      opacity: 0;
      -webkit-transform: translate(-320px);
      transform: translate(-320px);
    }
  }
</style>

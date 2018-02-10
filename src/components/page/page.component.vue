/**
* Created by guooug on 2017/6/15.
*/
<template lang="html">
  <div class="page-container" :class="className">
    <div>
      <slot name="other"></slot>
    </div>
    <header class="_header" v-if="hasHeader">
      <slot name="header"></slot>
    </header>
    <main class="_main _scroll" ref="_main"
          :class="scrollClass"
          @touchstart="touchStart($event)"
          @touchmove="touchMove($event)"
          @touchend="touchEnd($event)"
          @scroll="scroll($event)">
      <div class="scroll-inner" :style="scrollInnerStyle" ref="scrollInner">
        <!--下拉刷新-->
        <div ref="pullToRefreshLayer" class="pull-to-refresh-layer" v-if="!!onRefresh&&enableRefresh">
          <slot name="refresh">
            <p class="label-down">下拉刷新...</p>
            <p class="label-up">释放刷新...</p>
            <p class="label-refresh">
              <mt-spinner class="circle" type="fading-circle"></mt-spinner>
            </p>
          </slot>
        </div>

        <!--页面中的主要内容-->
        <slot name="main"></slot>

        <!--上拉加载数据-->
        <div class="infinite-layer" ref="infiniteLayer" v-if="enableInfinite&&touch">
          <slot name="infinite" v-if="showLoadMore">
            <div>
              <mt-spinner class="circle" type="fading-circle"></mt-spinner>
            </div>
            <div class="infinite-preloader circle">加载数据...</div>
          </slot>
        </div>
      </div>
    </main>
    <footer class="_footer" v-if="hasFooter">
      <slot name="footer"></slot>
    </footer>
    <slot name="mask" class="_mask"></slot>
    <div class="_mount-container" v-if="hasMount">
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import ScrollFix from './scrollFix'
  export default {
    props: {
      isScrollEvent: {
        type: Boolean,
        default: false
      },
      requireAuth: {
        type: Boolean,
        default: false
      },
      hasHeader: {
        type: Boolean,
        default: false
      },
      hasFooter: {
        type: Boolean,
        default: false
      },
      hasMount: {
        type: Boolean,
        default: true
      },
      scrollTop: {
        type: Number,
        default: 0
      },
//      滚动
      offset: {
        type: Number,
        default: 80
      },
      enableInfinite: {
        type: Boolean,
        default: false
      },
      enableRefresh: {
        type: Boolean,
        default: false
      },
      onRefresh: {
        type: Function,
        default: undefined,
        required: false
      },
      onInfinite: {
        type: Function,
        default: undefined,
        require: false
      },
      useFixScroll: {
        type: Boolean,
        default: true,
        require: false
      }
    },
    data () {
      return {
        currentScrollTop: 0,
        top: 0,
        state: 0, // 0:down, 1: up, 2: refreshing
        startY: 0,
        touch: false,
        touching: false,
        infiniteLoading: false,
        end: false,
        height: 0
      }
    },
    methods: {
      ...mapActions(['getUserToken']),
      scrollTo(top){
        this.$refs._main.scrollTop = top
      },

      touchStart (e) {
        this.touch = true
        this.startY = e.targetTouches[0].pageY
        this.startScroll = this.$refs._main.scrollTop || 0
        this.touching = true
      },
      touchMove (e) {
        if (!this.enableRefresh || this.$refs._main.scrollTop > 0 || !this.touching) {
          return
        }
        console.log(this.$refs._main.scrollTop)
        let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
        if (diff > 0) e.preventDefault()
        this.top = Math.pow(diff, 0.8) + (this.state === 2 ? this.offset : 0)

        if (this.state === 2) { // in refreshing
          return
        }
        if (this.top >= this.offset) {
          this.state = 1
        } else {
          this.state = 0
        }
      },
      touchEnd (e) {
        if (!this.enableRefresh) return
        this.touching = false
        if (this.state === 2) { // in refreshing
          this.state = 2
          this.top = this.offset
          return
        }
        if (this.top >= this.offset) { // do refresh
          if (this.enableRefresh) {
            this.refresh()
          }
        } else {  // cancel refresh
          this.state = 0
          this.top = 0
        }
      },
      refresh () {
        this.end = false
        this.state = 2
        this.top = this.offset
        this.onRefresh(this.refreshDone)
      },
      refreshDone () {
        this.state = 0
        this.top = 0
      },
      infinite () {
        this.height = this.$refs.scrollInner.offsetHeight
        this.infiniteLoading = true
        this.onInfinite(this.infiniteDone)
      },

      infiniteDone (end) {
        end ? this.end = true : this.end = false
        this.infiniteLoading = false
      },
      onScroll (e) {
        if (!this.enableInfinite || this.infiniteLoading || this.end) {
          return
        }
        let outerHeight = this.$refs._main.clientHeight
        let innerHeight = this.$refs.scrollInner.clientHeight
        let scrollTop = this.currentScrollTop
        let ptrHeight = this.onRefresh && this.enableRefresh ? this.$refs.pullToRefreshLayer.clientHeight : 0
        if (this.$refs.infiniteLayer) {
          let infiniteHeight = this.$refs.infiniteLayer.clientHeight
          let bottom = innerHeight - outerHeight - scrollTop - ptrHeight
          if (bottom < infiniteHeight) this.infinite()
        }
      },
      scroll(e){
        this.currentScrollTop = this.$refs._main.scrollTop
        if (this.enableRefresh) {
          this.$emit('onScroll', this.currentScrollTop + 44)
        } else {
          this.$emit('onScroll', this.currentScrollTop)
        }
        if (this.onInfinite || this.insfiniteLoading) {
          this.onScroll(e)
        }
      },
      getMain(){
        return this.$refs._main
      },
      // 重置滚动功能
      init(){
        Object.assign(this, this.$options.data())
      }
    },
    created(){
      if (this.$route.meta.requireAuth) {
        this.getUserToken({forceLogin: true}).catch(() => {
        })
      }
    },
    mounted(){
      /* eslint-disable no-new */
      if (this.useFixScroll) {
        new ScrollFix(this.$refs._main)
      }
    },
    activated(){
      this.$refs._main.scrollTop = this.currentScrollTop
    },
    computed: {
      className(){
        return {
          hasHeader: this.hasHeader,
          hasFooter: this.hasFooter
        }
      },
      showLoadMore(){
        return !this.end && this.height > (document.documentElement.clientHeight + 100)
      },
      scrollInnerStyle(){
        let transform = `translate3d(0, ${this.top}px, 0)`
        if (this.top > 0) {
          return {transform: transform}
        }
      },
      scrollClass(){
        return {
          'pull-down': (this.state === 0),
          'pull-up': (this.state === 1),
          refreshing: (this.state === 2),
          'has-refresh': this.enableRefresh,
          touching: this.touching
        }
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  .page-container {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    ._main {
      max-width: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      overflow-y: scroll;
      overflow-x: hidden;
      box-sizing: border-box;
      transition: all .4s cubic-bezier(.55, 0, .1, 1);
      -webkit-overflow-scrolling: touch;

      &.touching .scroll-inner {
        transition-duration: 0ms;
      }
      &:not(.refreshing) {
        .pull-to-refresh-layer .preloader {
          animation: none;
        }
      }
      &.refreshing {
        .pull-to-refresh-arrow {
          display: none;
          transition-duration: 0ms;
        }
        .preloader {
          visibility: visible;
        }
      }
      &.pull-up {
        .pull-to-refresh-arrow {
          transform: rotate(180deg) translate3d(0, 0, 0);
        }
      }
    }
    &.hasHeader {
      ._header {
        height: 44px;
        position: fixed;
        width: 100%;
        top: 0;
      }
      ._main {
        margin-top: 44px;
      }
    }
    &.hasFooter {
      ._footer {
        background-color: white;
        height: 49px;
        position: fixed;
        width: 100%;
        bottom: 0;
      }
      ._main {
        margin-bottom: 49px;
      }
    }
  }

  .pull-to-refresh-layer {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 44px;

    .preloader {
      visibility: hidden;
    }
    .pull-to-refresh-arrow {
      display: inline-block;
      margin-right: 5px;
      width: 6.5px;
      height: 10px;
      background: no-repeat center;
      background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 40'><polygon points='9,22 9,0 17,0 17,22 26,22 13.5,40 0,22' fill='#333333'/></svg>");
      background-size: 6.5px 10px;
      z-index: 10;
      transform: rotate(0deg) translate3d(0, 0, 0);
      transition-duration: 300ms;
    }

  }

  .scroll-inner {
    position: absolute;
    width: 100%;
    min-height: 100%;
    transition-duration: 300ms;
  }

  .has-refresh .scroll-inner {
    top: -44px;
  }

  .label-down, .label-up, .label-refresh {
    display: none;
    text-align: center;
  }

  .label-refresh {
    text-align: center;
  }

  .pull-down .label-down,
  .pull-up .label-up,
  .refreshing .label-refresh {
    display: block;
    padding-left: 5px;
  }

  .pull-to-refresh-layer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .infinite-layer {
    opacity: 0;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pull-down .infinite-layer {
    opacity: 1;
  }

  .infinite-preloader {
    margin-left: 10px;
  }

  .circle {
    color: #333;
  }

  ._mask {

  }

</style>

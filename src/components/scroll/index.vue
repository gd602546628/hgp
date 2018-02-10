<template>
  <div class="scroll _scroll"
       :class="scrollClass"
       @touchstart="touchStart($event)"
       @touchmove="touchMove($event)"
       @touchend="touchEnd($event)"
       @scroll="scroll($event)"
  >
    <div class="scroll-inner" :style="scrollInnerStyle" ref="scrollInner">
      <div class="pull-to-refresh-layer" v-if="!!onRefresh&&enableRefresh">
        <slot name="refresh">
          <div class="preloader"></div>
          <div class="pull-to-refresh-arrow"></div>
          <span class="label-down">下拉刷新...</span>
          <span class="label-up">释放刷新...</span>
          <p class="label-refresh">
            <mt-spinner class="circle" type="fading-circle"></mt-spinner>
          </p>
        </slot>
      </div>
      <slot></slot>
      <div class="infinite-layer" v-if="enableInfinite&&touch">
        <slot name="infinite">
          <div>
            <mt-spinner class="circle" type="fading-circle"></mt-spinner>
          </div>
          <div class="infinite-preloader circle">加载数据...</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      offset: {
        type: Number,
        default: 44
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
      onScrollEvent: {
        type: Function,
        default: undefined,
        require: false
      }
    },
    data () {
      return {
        top: 0,
        state: 0, // 0:down, 1: up, 2: refreshing
        startY: 0,
        touch: false,
        touching: false,
        infiniteLoading: false
      }
    },
    computed: {
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
    },
    mounted(){
    },
    methods: {
      touchStart (e) {
        this.touch = true
        this.startY = e.targetTouches[0].pageY
        this.startScroll = this.$el.scrollTop || 0
        this.touching = true
      },
      touchMove (e) {
        if (!this.enableRefresh || this.$el.scrollTop > 0 || !this.touching) {
          return
        }
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
        this.state = 2
        this.top = this.offset
        this.onRefresh(this.refreshDone)
      },
      refreshDone () {
        this.state = 0
        this.top = 0
      },

      infinite () {
        this.infiniteLoading = true
        this.onInfinite(this.infiniteDone)
      },

      infiniteDone () {
        this.infiniteLoading = false
      },
      onScroll (e) {
        if (!this.enableInfinite || this.infiniteLoading) {
          return
        }
        let outerHeight = this.$el.clientHeight
        let innerHeight = this.$el.querySelector('.scroll-inner').clientHeight
        let scrollTop = this.$el.scrollTop
        let ptrHeight = this.onRefresh ? this.$el.querySelector('.pull-to-refresh-layer').clientHeight : 0
        let infiniteHeight = this.$el.querySelector('.infinite-layer').clientHeight
        let bottom = innerHeight - outerHeight - scrollTop - ptrHeight
        if (bottom < infiniteHeight) this.infinite()
      },
      scroll(e){
        e.stopPropagation()
        if (this.onInfinite || this.insfiniteLoading) {
          this.onScroll(e)
        }
        let eventName = this.$route.name
        let scrollTop = this.$el.scrollTop
        if (this.onScrollEvent) {
          this.onScrollEvent(e, scrollTop)
        }
        this.$root.eventHub.$emit(eventName, scrollTop, e)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
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

  .scroll {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    &.content {
      position: absolute;
    }

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
        visibility: hidden;
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
    width: 50px;
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
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .infinite-preloader {
    margin-left: 10px;
  }

  .circle {
    color: #333;
  }
</style>

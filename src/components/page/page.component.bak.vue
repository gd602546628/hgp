/**
* Created by guooug on 2017/6/15.
*/
<template lang="html">
  <div class="page-container" :class="className">
    <header class="_header" v-if="hasHeader">
      <slot name="header"></slot>
    </header>
    <main class="_main">
      <zyt-scroll ref="scroll" :on-refresh="onRefresh" :enableRefresh="enableRefresh" :offset="offset"
                  :on-infinite="onInfinite"
                  :enableInfinite="enableInfinite" :onScrollEvent="onScrollEvent">
        <slot name="main"></slot>
      </zyt-scroll>
    </main>
    <footer class="_footer" v-if="hasFooter">
      <slot name="footer"></slot>
    </footer>
    <div>
      <slot name="other"></slot>
    </div>
    <div class="_mount-container" v-if="hasMount">
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    props: {
      offset: {
        type: Number,
        default: 60
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
        default: (done) => {
          done()
        },
        required: false
      },
      onInfinite: {
        type: Function,
        default: undefined,
        require: false
      },
      isScrollEvent: {
        type: Boolean,
        default: true
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
      }
    },
    methods: {
      ...mapActions(['getUserToken'])
    },
    created(){
      if (this.$route.meta.requireAuth) {
        this.getUserToken({forceLogin: true}).catch(() => {
        })
      }
      if (this.isScrollEvent) {
        this.onScrollEvent = (event, scrollTop) => {
          this.currentScrollTop = scrollTop
        }
      }
    },
    mounted(){
    },
    watch: {
      scrollTop(val){
        this.$refs.scroll.setScroll(val)
        this.currentScrollTop = val
      },
      currentScrollTop(val) {
        this.$emit('input', val)
      }
    },
    data () {
      return {
        className: {
          hasHeader: this.hasHeader,
          hasFooter: this.hasFooter
        },
        currentScrollTop: this.scrollTop,
        onScrollEvent: null
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" type="text/scss" scoped>
  /* .page-container {
     position: relative;
     &.hasHeader {
       ._header {
         height: 44px;
         position: fixed;
         width: 100%;
         top: 0;
         z-index: 9;
       }
       ._main {
         margin-top: 44px;
       }
     }
     &.hasFooter {
       ._footer {
         height: 49px;
         position: fixed;
         width: 100%;
         bottom: 0;
         z-index: 9;
         background-color: white;
       }
       ._main {
         margin-bottom: 49px;
       }
     }
   }*/

  .page-container {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    ._main {
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      overflow-y: scroll;
      box-sizing: border-box;
      transition: all .4s cubic-bezier(.55, 0, .1, 1);
      -webkit-overflow-scrolling: touch;
    }
    &.hasHeader {
      ._header {
        height: 44px;
        position: absolute;
        width: 100%;
        top: 0;
      }
      ._main {
        margin-top: 44px;
      }
    }
    &.hasFooter {
      ._footer {
        height: 49px;
        position: absolute;
        width: 100%;
        bottom: 0;
      }
      ._main {
        margin-bottom: 49px;
      }
    }
  }
</style>

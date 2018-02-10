<template>
  <div id='app' :class='platform'
       @touchstart="touchstart"
       @touchmove="touchend"
       @touchend="touchend">
    <transition :name='actionName'>
      <!-- <router-view class="_main-view"></router-view>-->
      <keep-alive :exclude='keepAliveExclude' ref="keepAlive">
        <router-view class="_main-view"></router-view>
      </keep-alive>
    </transition>
    <div class="download">
      <download-app></download-app>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import {mapState, mapActions, mapMutations} from 'vuex'
  import Util from '@/service/common/utils/util.service'
  import Native from '@/service/common/native/native.service'
  import downloadApp from '@/components/downloadApp/downloadApp.component'
  import {Config} from '@/config/config'

  export default {
    data() {
      return {
        actionName: '',
        touchTime: 0
      }
    },
    watch: {
      //  监听返回
      isBack(isBack) {
        if (this.isTouchPopState()) {
          this.actionName = ''
        } else {
          this.actionName = isBack ? 'right' : 'left'
        }
      }
    },
    computed: {
      ...mapState(['isBack', 'keepAliveExclude', 'keepAliveInclude']),
      platform() {
        return {
          android: Util.browser.versions.android,
          ios: Util.browser.versions.ios,
          isApp: Native.isApp()
        }
      },
    },
    mounted() {
      setTimeout(() => {
        this.actionName = 'left'
      }, 300)
      if (Native.isApp()) {
        Native.todoNative('convenient_life', 'showTitleRightView', {})
      }
    },
    methods: {
      ...mapActions(['getUserToken']),
      ...mapMutations(['setAuditingIosApp']),
      isTouchPopState() {
        return (new Date().getTime() - this.touchTime) < 500
      },
      touchend(event) {
        if (Util.browser.versions.ios) {
          let clientX = event.changedTouches[0].clientX
          let clientY = event.changedTouches[0].clientY
          let x = Math.abs(clientX - this.clientX)
          let y = Math.abs(clientY - this.clientY)
          if (y < x) {
            this.touchTime = new Date().getTime()
          }
        }
      },
      touchstart(event) {
        if (Util.browser.versions.ios) {
          this.clientX = event.touches[0].clientX
          this.clientY = event.touches[0].clientY
        }
      },
      async isAuditingIosApp() {
        let result = false
        if (Util.browser.versions.ios && Native.isApp()) {
          let appVersion = await Util.getAppVersion()
          result = Util.compareVersion(appVersion, Config.iosVersion)
        }
        this.setAuditingIosApp({
          isAuditingIosApp: result
        })
      }
    },
    created() {
      // 如果在App下，判断用户有没有登录
      if (Native.isApp()) {
        this.getUserToken({
          forceLogin: false
        })
      }
      this.isAuditingIosApp()
    },
    components: {
      'download-app': downloadApp
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' type='text/scss'>


  ._main-view {
    background: white;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    transition: all .4s cubic-bezier(.55, 0, .1, 1);
  }

  .ios {
    .left-enter,
    .right-leave-to {
      -webkit-transform: translate(100%);
      transform: translate(100%);
    }
    .right-enter,
    .left-leave-to {
      -webkit-transform: translate(-100%);
      transform: translate(-100%);
    }
  }

  .android {
    .left-enter,
    .right-leave-to {
      z-index: 2;
      opacity: 0;
      -webkit-transform: translate(320px);
      transform: translate(320px);
    }
    .right-enter,
    .left-leave-to {
      z-index: 2;
      opacity: 0;
      -webkit-transform: translate(-320px);
      transform: translate(-320px);
    }
  }
</style>

<style lang='scss' rel='stylesheet/scss' type='text/scss'>
  @import 'assets/css/variables-primary.scss';
  @import 'assets/css/reset.scss';
  @import 'assets/css/common.scss';
  @import 'assets/css/row.scss';
  @import 'assets/css/transition.scss';
  @import url('assets/icon.font.scss');
  @import './service/toast/toast.scss';
</style>

<style lang='scss' rel='stylesheet/scss' type='text/scss'>
  /*富文本编辑器相关的样式 需要与后台相统一 begin*/
  .prd-content img {
    max-width: 100%;
  }

  .placeholder-img {
    width: 100%;
    height: auto;
  }

  .s-content-content img {
    /* max-width: 100%;*/
  }

  .s-single-img {
    position: relative;
    width: 100%;
  }

  .s-img-container {
    height: 200px;
    /*background-image: url("../img/content.png");*/
    background-size: cover;
    background-position: center;
  }

  .img-box {
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;
    background-position: center;
    /* background-size:auto 60%;*/
    /* background-size: 100% auto;*/
    -webkit-background-size: contain;
    -moz-background-size: contain;
    -o-background-size: contain;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .pic-list {
    letter-spacing: -1px;
    font-size: 0px;
    width: 100%;
    height: 188px;
    position: relative;
  }

  .pic-list p {
    font-size: .7rem;
    display: inline-block;
    position: absolute;
    bottom: 0px;
    right: 2px;
    z-index: 2;
    background: url("./assets/img/bgb.png") repeat;
    color: white;
    padding: .2rem .5rem .2rem .5rem;
  }

  .pic-list .show-pic {
    letter-spacing: 1px;
    background-size: cover;
  }

  .pic-list-num-1 .show-pic {
    height: 100%;
    width: 100%;
  }

  .pic-list-num-2 .show-pic {
    height: 100%;
    display: inline-block;
    width: 50%;
    box-sizing: border-box;
  }

  .pic-list-num-2 .show-pic:first-child {
    border-right: 2px solid #EFEFEF;
  }

  .pic-list-num-3 .show-pic {
    position: absolute;
    width: 50%;
    box-sizing: border-box;
  }

  .pic-list-num-3 .show-pic:first-child {
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    /*  background-image: url('../img/photo-2.png');*/
  }

  .pic-list-num-3 .show-pic:nth-child(2) {
    z-index: 2;
    border-left: 2px solid #EFEFEF;
    height: 100%;
    right: 0px;
    top: 0px;
    /* background-image: url('../img/photo-1.png');*/
  }

  .pic-list-num-3 .show-pic:nth-child(3) {
    z-index: 3;
    border-left: 2px solid #EFEFEF;
    border-top: 2px solid #EFEFEF;
    height: 50%;
    right: 0px;
    top: 50%;
    /*  background-image: url('../img/photo-1.png');*/
  }

  .s-video-container {
    position: relative;
  }

  .s-temp-title {
    color: white;
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    background-image: url('./assets/img/bgb.png');
    background-repeat: repeat;
  }

  .video-object-play-btn {
    background-image: url('./assets/img/icon_play.png');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    margin-left: -15px;
    margin-top: -15px;
  }

  .video-object {
    /*background-image: url('../img/defaultPlay.png');*/
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    max-width: 100%;
    min-height: 188px;
  }

  video {
    cursor: pointer;
    max-width: 100%;
  }

  /**视屏播放的样式**/
  .photoShow-video-container {
    height: 100%;
    width: 100%;
    display: box;
    display: -webkit-box !important;
    -webkit-box-align: center !important;
    box-align: center;
    -webkit-box-pack: center !important;
    box-pack: center;
  }

  .photoShow-video-container video {
    width: 100%;
  }

  .pswp__button--share {
    display: none;
  }

  .picShow-title {
    text-align: center;
    font-size: 14px;
  }

  .picShow-desc {
    font-size: 12px;
  }

  .show-pic {
    cursor: pointer;
  }

  .pswp-rightBottom-btn {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    bottom: 10px;
    background-repeat: no-repeat;
    background-size: 90%;
  }

  /*富文本编辑器相关的样式 需要与后台相统一 end*/

</style>

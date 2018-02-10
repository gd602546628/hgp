<template>
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" ref="pswp" @click="close()">

    <!-- Background of PhotoSwipe.
         It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

      <!-- Container that holds slides.
          PhotoSwipe keeps only 3 of them in the DOM to save memory.
          Don't modify these 3 pswp__item elements, data is added later on. -->
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>

      <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
      <div class="pswp__ui pswp__ui--hidden">

        <div class="pswp__top-bar">

          <!--  Controls are self-explanatory. Order can be changed. -->

          <div class="pswp__counter"></div>

          <button ref="pswp__button" class="pswp__button pswp__button--close" title="Close (Esc)"></button>

          <!-- <button class="pswp__button pswp__button&#45;&#45;share" title="Share"></button>-->

          <!--   <button class="pswp__button pswp__button&#45;&#45;fs" title="Toggle fullscreen"></button>-->

          <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

          <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
          <!-- element will get class pswp__preloader--active when preloader is running -->
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>

        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
        </button>

        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
        </button>

        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>

      </div>


    </div>
    <div class="save-btn icon-zyt-menu" @click="saveImg($event)" ref="saveImg" v-if="isApp"></div>
  </div>
</template>
<script>
  import Util from '@/service/common/utils/util.service'
  import PhotoSwipe from 'photoswipe/dist/photoswipe'
  import PhotoSwipeDefaultUI from 'photoswipe/dist/photoswipe-ui-default'
  import 'photoswipe/dist/photoswipe.css'
  import 'photoswipe/dist/default-skin/default-skin.css'
  import native from '@/service/common/native/native.service'

  export default {
    data() {
      return {
        options: {
          index: 0,
          history: false,
          maxSpreadZoom: 3
        }
      }
    },
    computed: {
      isApp() {
        return native.isApp()
      },
      imgs() {
        return [].concat(this.aImg)
      }
    },
    methods: {
      close() {
        this.$refs.pswp__button.click()
      },
      async loadImg(item) {
        return new Promise((resolve, reject) => {
          let img = new Image()
          img.src = item.src
          let setWidthHeight = () => {
            let width = img.width
            let height = img.height
            let clientWidth = document.documentElement.clientWidth
            if (width > clientWidth && clientWidth) {
              height = height * clientWidth / width
              width = clientWidth
            }
            item.w = width
            item.h = height
            resolve(item)
          }
          if (img.complete) {
            setWidthHeight()
          }
          img.onload = () => {
            setWidthHeight()
          }
          img.onerror = () => {
            reject(item)
          }
        })
      },
      saveImg(e) {
        e.stopPropagation()
        let that = this
        native.todoNative('common_native', 'showQRCodeImageWindow', {
          qrImgUrl: that.gallery.currItem.src
        })
      },
      async show(imgs, index) {
        let items = await this.getItems(imgs)
        if (!items) {
          return
        }
        let options = Object.assign({}, this.options, {
          index: index
        })
        if (this.gallery) {
          // this.gallery.destroy && this.gallery.destroy()
          this.gallery = null
        }
        let el = this.$refs.pswp
        this.gallery = new PhotoSwipe(el, PhotoSwipeDefaultUI, items, options)
        this.gallery.init()
      },
      async getItems(imgs) {
        let items = []
        let arr = [].concat(imgs)
        let promises = []
        arr.forEach((item, i) => {
          let scr = Util.addImgPrefix(item)
          let result = {
            src: scr,
            w: 0,
            h: 0
          }
          promises.push(this.loadImg(result))
          items.push(result)
        })
        await Promise.all(promises).then((data) => {
        }).catch((e) => {
          return null
        })
        return items
      },
      async playVideo({videourl, poster, videotitle, description}) {
        let html =
          `<div class="photoShow-video-container">
            <video id="photoShow-video" poster='${poster}' autoplay="autoplay" controls="controls" preload="preload" >
              <source src="${videourl}" type="video/ogg">
              <source src="${videourl}" type="video/mp4">
            </video>
           </div>`
        let items = [{
          html: html,
          title: videotitle || '',
          desc: description || ''
        }]
        if (this.gallery) {
          // this.gallery.destroy && this.gallery.destroy()
          this.gallery = null
        }
        let el = this.$refs.pswp
        this.gallery = new PhotoSwipe(el, PhotoSwipeDefaultUI, items)
        this.gallery.init()
        var video = document.getElementById('photoShow-video')
        video.play()
      }
    },
    mounted() {
    }
  }
</script>
<style lang='scss' rel='stylesheet/scss' scoped type="text/scss">
  .save-btn {
    color: #ffffff;
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 20px;
  }

  .pswp {
    z-index: 10000;
  }
</style>

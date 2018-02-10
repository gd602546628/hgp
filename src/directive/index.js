/**
 * Created by guooug on 2017/6/27.
 */
import PhotoSwiperService from '@/service/photo-swiper/photo-swiper.service.js'

let ueditor = {
  bind: function (el) {
    // 展示图集
    let showPic = (node) => {
      let nodes = node.parentNode.querySelectorAll('.show-pic')
      let pics = []
      let index = 0
      if (nodes.length) {
        nodes.forEach((item, i) => {
          if (item === node) {
            index = i
          }
          pics.push(item.getAttribute('data-imgsrc'))
        })
        PhotoSwiperService.show(pics, index)
      }
    }
    // 展示视屏
    let showVideo = (node) => {
      let params = {
        videourl: node.getAttribute('data-videourl'),
        poster: node.getAttribute('data-imgsrc'),
        videotitle: node.getAttribute('data-videotitle'),
        description: node.getAttribute('data-description')
      }
      PhotoSwiperService.playVideo(params)
    }
    // 展示大图
    let showImg = (node) => {
      if (node.width > 100) {
        PhotoSwiperService.show(node.currentSrc)
      }
    }
    try {
      el.addEventListener('click', function (ev) {
        var target = ev.target
        while (target !== el) {
          if (target.classList.contains('show-pic')) {
            showPic(target)
            break
          } else if (target.tagName.toLowerCase() === 'img') {
            showImg(target)
            break
          } else if (target.classList.contains('video-object')) {
            showVideo(target)
            break
          }
          target = target.parentNode
        }
      })
    } catch (e) {
      console.info(e)
    }
  }
}
export default (Vue, options) => {
  Vue.directive('ueditor', ueditor)
}


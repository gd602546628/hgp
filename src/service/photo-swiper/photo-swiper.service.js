/**
 * Created by guooug on 2017/8/10.
 */
import Vue from 'vue'
import photoSwipeComponent from '@/components/photoSwipe/photoSwipe.component'
class PhotoSwiperService {
  constructor () {
    let constructor = Vue.extend(photoSwipeComponent)
    this.instance = new constructor({el: document.createElement('div')})
    document.body.appendChild(this.instance.$el)
  }

  show (imgs, index = 0) {
    this.instance.show(imgs, index)
  }
  playVideo({videourl, poster, videotitle, description}){
    this.instance.playVideo(arguments[0])
  }
}
export default new PhotoSwiperService()

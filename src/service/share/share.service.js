/**
 * Created by guooug on 2017/7/5.
 */
import Vue from 'vue'
import {defaultShare} from '@/config/config'
import Native from '@/service/common/native/native.service'
import WeixinService from '@/service/weixin/weixin.service'
import weixinShareTipComponent from '@/components/share/weixin-share-tip.component'

class ShareService {
  constructor () {
    this.className = 'common_native'
    this.methodName = 'doShare'
    let WeixinShareTipConstructor = Vue.extend(weixinShareTipComponent)
    this.instance = new WeixinShareTipConstructor({el: document.createElement('div')})
    document.body.appendChild(this.instance.$el)
  }

  getWxDefaultInfo = (isRootPage) => {
    let link = window.location.href
    if (isRootPage) {
      link = link.split('#')[0]
    }
    return {
      'imgUrl': defaultShare.imgUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
      'desc': defaultShare.desc,
      'title': defaultShare.title, // 分享卡片标题
      'link': link // 分享出去后的链接，这里可以将链接设置为另一个页面。
    }
  }

  getServantMainDefaultInfo = (isRootPage) => {
    let link = window.location.href
    let title = document.title
    if (isRootPage) {
      link = link.split('#')[0]
      link = link + '#/servantMain'
    }
    let imgUrl = this.getImgUrl()
    return {
      'imgUrl': imgUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
      'desc': '',
      'title': title, // 分享卡片标题
      'link': link // 分享出去后的链接，这里可以将链接设置为另一个页面。
    }
  }

  getImgUrl () {
    let imgs = document.getElementsByTagName('img') || []
    let reg = /^http/
    for (let i = 0; i < imgs.length; i++) {
      if (reg.test(imgs[i].currentSrc)) {
        return imgs[i].currentSrc
      }
    }

    let imgContainers = document.getElementsByClassName('_img-container') || []

    for (let i = 0; i < imgContainers.length; i++) {
      var backgroundImage = imgContainers[i].style.backgroundImage
      if (backgroundImage) {
        backgroundImage = backgroundImage.split('(')[1].split(')')[0]
      }
      if (reg.test(backgroundImage)) {
        return backgroundImage
      }
    }
    return ''
  }

  _doShareByApp (params) {
    return Native.todoNative(this.className, this.methodName, params)
  }

  /**
   *
   * @param params
   shareLinkTitle
   shareLinkContent
   shareLink
   shareImgUrl
   * @private
   */
  _doShareByH5 (params) {
    if (!WeixinService.isWeixin()) {
      return Promise.resolve('') // 不是微信浏览器，所以不能知道是否会分享成功
    }
    this.instance.show()
    return new Promise((resolve, reject) => {
      let success = () => {
        this.instance.close()
        resolve()
      }
      let fail = () => {
        this.instance.close()
        reject('分享失败')
      }
      let data = Object.assign({}, params, {
        success: success,
        cancel: fail,
        fail: fail
      })
      WeixinService.setShare(data)
    })
  }

  doShare = ({title, desc, link, imgUrl, shareType, shareContentType}) => {
    if (Native.isApp()) {
      return this._doShareByApp({
        shareImgUrl: imgUrl || '',
        shareLinkTitle: title || '',
        shareLinkContent: desc || '',
        shareLink: link || '',
        shareType: shareType || '0',
        shareContentType: shareContentType || ''
      })
    } else {
      return this._doShareByH5({
        imgUrl: imgUrl,
        title: title,
        desc: desc,
        link: link
      })
    }
  }
  setWxShare = ({title, desc, link, imgUrl}) => {
    WeixinService.setShare({
      title: title,
      desc: desc,
      link: link,
      imgUrl: imgUrl
    })
  }
}
export default new ShareService()

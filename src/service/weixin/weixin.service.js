/**
 * Created by guooug on 2017/7/5.
 */
import wx from 'weixin-js-sdk'
import WeixinApi from '@/api/weixin/weixin.api'
import Util from '@/service/common/utils/util.service'
import {Config} from '@/config/config'
import axios from 'axios'
class WeixinService {
  constructor() {
    this.readyPromise = null
    this.first = true
    this.secret = 'd10006d90489046e54f556b9e28cac3d'
    this.jsApiList = [
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'sendAppMessage'
    ]
    this.init()
    this.authorizeData = {
      appid: Config.wxAppId,
      redirect_uri: '',
      response_type: 'code',
      scope: 'snsapi_base',
      state: 'STATE'
    }
  }

  async init(isRefresh) {
    if (this.isWeixin() && wx) {
      this.readyPromise = new Promise(async (resolve, reject) => {
        let config = await this.getConfig(isRefresh)
        if (config) {
          wx.config(config)
          wx.ready(() => {
            this.first = false
            resolve()
          })
          wx.error((res) => {
            if (this.first) {
              this.init(true)
            } else {
              reject()
            }
            this.first = false
            console.info('微信sdk调用出错', res)
          })
        }
      })
    }
  }

  /**
   * 设置分享的内容
   * @param share
   * {
   *     "imgUrl": "http://www.yourwebsite.com/share.png",//分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
   *     "desc" : "你对页面的描述",//摘要,如果分享到朋友圈的话，不显示摘要。
   *     "title" : '分享卡片的标题',//分享卡片标题
   *     "link": window.location.href,//分享出去后的链接，这里可以将链接设置为另一个页面。
   *     "success":function(){//分享成功后的回调函数
   *     },
   *     'cancel': function () {
   *         // 用户取消分享后执行的回调函数
   *     }
   * }
   */
  setShare(share) {
    if (this.isWeixin()) {
      this.readyPromise.then(() => {
        wx.onMenuShareAppMessage(share) // 分享给好友
        wx.onMenuShareTimeline(share) // 分享到朋友圈
        wx.onMenuShareQQ(share)  // 分享给手机QQ
        wx.onMenuShareQZone(share) // 分享到qq空间
      }).catch((e) => {
      })
    }
  }

  async getConfig(isRefresh) {
    let url = window.location.href.split('#')[0]
    let config = await WeixinApi.getWeixinConfig(url, isRefresh)
    if (config) {
      config['jsApiList'] = this.jsApiList
      config['isDug'] = true
      return config
    } else {
      return null
    }
  }

  isWeixin() {
    let ua = navigator.userAgent.toLowerCase()
    /* eslint-disable */
    if (ua.match(/microMessenger/i) == 'micromessenger') {
      return true
    }
    return false
  }

  openAuth(url) {
    let redirect_uri = encodeURIComponent(url)
    this.authorizeData.redirect_uri = redirect_uri
    let authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.authorizeData.appid}&redirect_uri=${this.authorizeData.redirect_uri}&response_type=${this.authorizeData.response_type}&scope=${this.authorizeData.scope}&state=${this.authorizeData.state}#wechat_redirect`
    window.location.href = authorizeUrl
  }

  async getOpenId(refresh, showLoading=false) {
    if (!this.isWeixin()) {
      return Promise.resolve('')
    } else {
      var code = Util.getUrlParam('code')
      var state = Util.getUrlParam('state')
      if (code && state) {
        let result = await WeixinApi.getWxJSApiInfo(code, showLoading)
        if (result.code == "000000") {
          // TODO 先将openID写死调试
          var openId = result.data.openid
          if (openId) {
            return Promise.resolve(openId)
          } else {
            return Promise.reject('')
          }
        } else {
          // window.history.replaceState('', '', window.location.href.replace(search, ''))
          return Promise.reject('')
        }
      }
    }
  }

  async getAcessToken(code) {
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${Config.wxAppId}&secret=${this.secret}&code=${code}&grant_type=authorization_code`
    url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${Config.wxAppId}&secret=${this.secret}`
    url = `http://172.31.60.189/zc/pay/getWxJSApiInfo`
    let data = await axios.post(url, {code: code}).catch()
    console.log(data)
  }
}

export default new WeixinService()

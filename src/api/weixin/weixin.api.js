/**
 * Created by guooug on 2017/7/7.
 */
import http from '@/service/common/http/http.service'
import {Codes} from '@/config/config'
class UserApi {
  constructor() {
    this.getWeixinConfigUrl = 'common/getWxJSApiInfo1'
    this.getWxJSApiInfoUrl = 'common/url/getWxJSApiInfo' // 获取微信公众号的id
  }

  // 需要签名的url
  async getWeixinConfig(url, isRefresh) {
    let data = await http.post(this.getWeixinConfigUrl, {
      url: url,
      isRefresh: isRefresh
    }).then((data) => {
      if (data.code === Codes.success) {
        return data.data
      } else {
        return null
      }
    }).catch((e) => {
    })
    return data
  }

  async getWxJSApiInfo(code, showLoading = false) {
    let url = this.getWxJSApiInfoUrl + `?code=${code}`
    let data = await http.post(url, {code: code}, {showLoading: showLoading})
    return data
  }
}
export default new UserApi()

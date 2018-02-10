/**
 * Created by lqj on 2017/6/21
 */

import http from '@/service/common/http/http.service'
class PreferredService {
  constructor() {
    this.rcmListUrl = 'advert/getAdvertCaroucels' // 获取轮播
  }

  async getCaroucelList(params, option) {
    let data = await http.post(this.rcmListUrl, params, option)
    let result = {
      list: []
    }
    data.data.forEach(item => {
      result.list.push(item)
    })
    return result
  }
}
export default new PreferredService()

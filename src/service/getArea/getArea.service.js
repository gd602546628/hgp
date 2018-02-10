/**
 * Created by gd on 2017/6/13/013.
 */

import http from '@/service/common/http/http.service'
class GetArea {
  constructor() {
    this.firstAreaUrl = 'common/url/getAllFirstArea'// 一级区域
    this.otherAreaUrl = 'common/url/getOtherArea'// 二三级区域
    this.allAreaUrl = 'common/url/getAllArea' // 获取所有地区
    this.openCityListUrl = 'zyb/getOpenCityList' // 获取生活——开放城市接口
  }

  async getFirstArea(params) {
    let data = await http.post(this.firstAreaUrl, params)
    return data
  }

  async getOtherArea(params) {
    let data = await http.post(this.otherAreaUrl, params)
    return data
  }

  async getAllArea(params) {
    let data = await http.post(this.allAreaUrl, params)
    return data
  }

  // 获取生活——开放城市接口
  async getOpenCityList(params) {
    let data = await http.post(this.openCityListUrl, params)
    return data
  }
}
export default new GetArea()

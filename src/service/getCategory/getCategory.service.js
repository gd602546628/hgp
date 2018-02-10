/**
 * Created by gd on 2017/6/14/014.
 */

import http from '@/service/common/http/http.service'

class GetCategory {
  constructor() {
    this.couponCategory = 'search/getCouponCategory'// 优惠券分类
    this.goodCategory = 'search/getPrdCategory' // 商品分类
    this.getFCouponCateUrl = 'search/getFCouponCate' // 优惠券全部二级分类
  }

  async getCouponCategory(params = {city: '玉溪市', country: '红塔区'}) {
    params.country = params.country || null
    let result = []
    let data = await http.post(this.couponCategory, params)
    data.data.forEach(doorCate => {
      doorCate.nextCates.forEach(fcCate => {
        fcCate['doorCateName'] = doorCate.cateName
      })
      result.push(doorCate)
    })
    return result
  }

  // 获取优惠券一级分类
  async getFirstCouponCategory(params = {city: '玉溪市', country: '红塔区'}) {
    let data = await http.post(this.couponCategory, params)
    let result = []
    data.data.forEach(item => {
      item.nextCate.forEach(nextCate => {
        result.push(nextCate)
      })
    })
    return result
  }

  async getGoodsCategory(params) {
    if (!params.doorCateNames) {
      params.doorCateNames = ['网上商城', '批发采购', '地方特产']
    }
    let data = await http.post(this.goodCategory, params)
    let category = data.data
    category.forEach(doorCate => {
      doorCate.nextCates.forEach(fcCate => {
        fcCate.parent = doorCate.cateName
        fcCate.nextCates.forEach(scCate => {
          scCate.parent = fcCate.cateName
        })
      })
    })
    return category
  }

  async getCouponAllCate(params = {}) {
    let data = await http.post(this.getFCouponCateUrl, params)
    return data.data
  }
}

export default new GetCategory()

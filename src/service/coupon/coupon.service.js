/**
 * Created by gd on 2017/6/17/017.
 */

import http from '@/service/common/http/http.service'
import { Codes } from '@/config/config'
import { couponSearchAdaptor } from './adaptor'

class Coupon {
  constructor () {
    this.searchCouponUrl = 'search/getCouponSearchList' // 优惠券搜索
    this.userReceiveCoupon = 'user/url/receiveCoupon' // 筛选用户已经领取的优惠券；
    this.addCoupon = 'user/url/addCoupon' // 用户领取优惠券
    this.userCouponId = 'user/getUserCouponId' // 获取优惠券UserCouponId
    this.couponDetail = 'getCouponDetail' // 获取优惠劵详情
    this.activityCouponDetail = 'getActivityCouponInfo' // 获取活动优惠劵详情
    this.userCouponInfo = 'user/url/getUserCouponInfo' // 获取优惠码
    this.getCouponListUrl = 'getCouponList' // 获取店铺的优惠券列表
    this.userCouponList = 'user/url/getCouponList' // 用户优惠券列表
    this.delCoupon = 'user/url/delCoupon' // 删除优惠券
    this.getAdvertCaroucels = 'advert/getAdvertCouponList' // 广告接口
    this.getDoorInfoUrl = 'door/getDoorInfo' // 获取店铺信息
    this.getGiftcoupon = 'getOtherCouponsList' // 获取赠送优惠券列表
  }

  // 搜索优惠券
  async searchCoupon (params, option) {
    params.country = params.country || null
    let data = await http.post(this.searchCouponUrl, params, option)
    let result = {
      list: [],
      page: {
        pageNum: data.data.page.pageNum,
        totalPage: data.data.page.totalPage
      }
    }
    data.data.dataList.forEach(item => {
      result.list.push(couponSearchAdaptor(item))
    })
    return result
  }

  // 获取领取未使用的优惠券ID
  async getReceivedCoupon (couponList) {
    let ids = []
    couponList.forEach(coupon => {
      ids.push(coupon.couponId || coupon.id)
    })
    let data = await http.post(this.userReceiveCoupon, {couponIds: ids}, {token: true})
    if (data.data.length === 0) {
      return
    }
    data.data.forEach(id => {
      couponList.forEach(coupon => {
        if (parseInt(coupon.couponId || coupon.id) === parseInt(id)) {
          coupon.receive = true
        }
      })
    })
  }

  async isReceiveCoupon (id) {
    let ids = [id]
    let data = await http.post(this.userReceiveCoupon, {couponIds: ids}, {token: true})
    console.log(data)
  }

  // 领取优惠券
  async receiveCoupon (params) {
    let data = await http.post(this.addCoupon, params, {
      token: true,
      showLoading: true
    }).catch((e) => {
      console.info(e)
    })
    return data
  }

  // 获取优惠劵详情
  async getCouponDetail (params) {
    let data = await http.post(this.couponDetail, params)
    return data
  }

  // 获取活动优惠劵详情
  async getActivityCouponDetail (params) {
    let data = await http.post(this.activityCouponDetail, params)
    return data
  }

  // 获取优惠券UserCouponId
  async getUserCouponId (params) {
    let data = await http.post(this.userCouponId, params, {token: true, showLoading: true})
    return data
  }

  // 获取优惠码
  async getUserCouponInfo (params) {
    let data = await http.post(this.userCouponInfo, params, {token: true})
    return data
  }

  /**
   *  h获取店铺发布的优惠券
   * @param doorId
   * @param keyType
   * 0-店铺首页券展示，1-可用券展示
   * @returns {Promise.<Array>}
   */
  async getCouponList (doorId, keyType = 0) {
    let data = await http.post(this.getCouponListUrl, {
      doorId: doorId,
      keyType: keyType
    }).catch((e) => {
      console.log('getCouponList', e)
    })
    if (data.code === Codes.success) {
      let list = []
      data.data.forEach(item => {
        list.push(couponSearchAdaptor(item))
      })
      return list
    } else {
      return []
    }
  }

  // 用户优惠券列表
  async getUserCouponList (params, option) {
    option.token = true
    let data = await http.post(this.userCouponList, params, option)
    let result = {
      page: {
        pageNum: data.data.page.pageNum,
        totalPage: data.data.page.allPage
      },
      list: []
    }
    data.data.couponInfoRes.forEach(item => {
      result.list.push(couponSearchAdaptor(item))
    })
    return result
  }

  // 删除优惠券
  async deleteCoupon (params) {
    let data = await http.post(this.delCoupon, params, {token: true, showLoading: true})
    return data
  }

  // 微信优惠券广告
  async getAdvertCoupon (params) {
    let data = await http.post(this.getAdvertCaroucels, params)
    let result = []
    data.data.lists.forEach(coupon => {
      result.push(couponSearchAdaptor(coupon))
    })
    let list = {
      list: result,
      totalPage: data.data.totalPage,
      pageNum: data.data.pageNum
    }
    return list
  }

  // 获取店铺信息
  async getDoorInfo (params) {
    let data = await http.post(this.getDoorInfoUrl, params)
    return data
  }

  // 获取赠送优惠券列表
  async complimentaryCoupons (params) {
    let data = await http.post(this.getGiftcoupon, params)
    let list = []
    if (data.data) {
      data.data.forEach(item => {
        list.push(couponSearchAdaptor(item))
      })
      return list
    } else {
      return data
    }
  }
}

export default new Coupon()

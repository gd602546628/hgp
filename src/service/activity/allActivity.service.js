/**
 * Created by LQJ on 2017/6/22.
 */

import http from '@/service/common/http/http.service'
import { doorAdaptor } from '@/service/preferred/doorAdaptor'
import { ProductListAdaptor } from '@/service/productList/adaptor'
import { couponSearchAdaptor } from '@/service/coupon/adaptor'
class ActivityService {
  constructor () {
    this.allActivitListUrl = 'activity/getActivityList' // 获取所有活动列表
    this.ActivitDetailListUrl = 'activity/getActivityDetailList' // 获取活动详情列表
    this.highestDiscount = 'getStoreActivityHighestDiscountList' // 获取最高优惠
    this.addActivityViewNum = 'activity/addActivityViewNum' // 更新活动点击量
  }

  // 更新活动点击量
  async getAddActivityViewNum (params) {
    let data = await http.post(this.addActivityViewNum, params)
    let result = data.data
    return result
  }

  async getAllActive (params, option) { // 获取所有活动列表
    let data = await http.post(this.allActivitListUrl, params, option)
    if (data.data && data.data.allActivitys) {
      let result = {
        list: [],
        page: {
          pageNum: data.data.page.pageNum,
          totalPage: data.data.page.totalPage
        }
      }
      data.data.allActivitys.forEach(item => {
        if (item.activityType === 1) {
          item.category = 5
        } else {
          item.category = 3
        }
      })
      result.list = data.data.allActivitys
      return result
    }
  }

  async getActivitDetail (params, option) { // 获取活动详情列表
    let data = await http.post(this.ActivitDetailListUrl, params, option)
    if (data.data) {
      let result = data.data
      return result
    }
  }

  // 活动说明
  async getActivityExplain (params, option) { // 获取所有活动列表
    let data = await http.post(this.ActivitDetailListUrl, params, option)
    if (data.data.activityBase) {
      let result = data.data.activityBase
      return result
    }
  }

  // 店铺活动
  async getDoorActiveList (params, option) {
    let data = await http.post(this.ActivitDetailListUrl, params, option)
    if (data.data.activityDoorList) {
      let result = {
        page: {
          pageNum: data.data.activityDoorList.page.pageNum,
          totalPage: data.data.activityDoorList.page.totalPage
        },
        list: []
      }
      let ids = []
      data.data.activityDoorList.storeActivityList.forEach(item => {
        ids.push(item.id)
        result.list.push(doorAdaptor(item))
      })

      let highPrice = await http.post(this.highestDiscount, ids)
      highPrice.data.forEach(data => {
        result.list.forEach(item => {
          if (item.doorId === data.doorId) {
            item.doorActivityList = data.doorActivityList
          }
        })
      })
      return result
    }
  }

  // 折扣活动
  async getDiscountList (params, option) {
    let data = await http.post(this.ActivitDetailListUrl, params, option)
    if (data.data.activityPrdList) {
      let result = {
        list: [],
        activityBase: null,
        page: {
          pageNum: data.data.activityPrdList.pages.pageNum,
          totalPage: data.data.activityPrdList.pages.totalPage
        }
      }
      data.data.activityPrdList.prdActivityList.forEach(item => {
        result.list.push(ProductListAdaptor(item))
      })
      result.activityBase = data.data.activityBase
      return result
    }
  }

  // 优惠活动
  async getCouponList (params, option) {
    let data = await http.post(this.ActivitDetailListUrl, params, option)
    if (data.data.activityCouponList) {
      let result = {
        list: [],
        activityBase: null,
        page: {
          pageNum: data.data.activityCouponList.page.pageNum,
          totalPage: data.data.activityCouponList.page.totalPage
        }
      }
      data.data.activityCouponList.storeCoupons.forEach(item => {
        result.list.push(couponSearchAdaptor(item))
      })
      result.activityBase = data.data.activityBase
      return result
    } else {
      throw new Error('列表为空')
    }
  }
}
export default new ActivityService()

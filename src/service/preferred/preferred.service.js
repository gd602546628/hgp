/**
 * Created by lqj on 2017/6/19
 */

import http from '@/service/common/http/http.service'
import {doorAdaptor} from './doorAdaptor'

class PreferredService {
  constructor() {
    this.rcmListUrl = 'advert/getAdvertRecommendDoorList' // 优选推荐
    this.advertCaroucels = 'advert/getAdvertCaroucels' // 轮播
    this.getLifeSearchList = 'search/getLifeSearchList' // 好生活搜索
    this.highestDiscount = 'getStoreActivityHighestDiscountList' // 获取最高优惠
    this.childCate = 'common/url/getChildCate' // 获取分类
    this.getLifeCateUrl = 'common/url/getLifeCate' // 获取好生活全部分类
  }

  async getPrefdList(params, option) {
    let data = await http.post(this.rcmListUrl, params, option)
    let result = {
      page: {
        pageNum: data.data.pageNum,
        totalPage: data.data.totalPage
      },
      list: []
    }
    data.data.lists.forEach(item => {
      result.list.push(doorAdaptor(item))
    })
    return result
  }

  // 获取轮播
  async getCaroucels(params) {
    let data = await http.post(this.advertCaroucels, params)
    return data.data
  }

  // 获取最高优惠
  async getHighestDiscount(params) {
    let data = await http.post(this.highestDiscount, params)
    return data
  }

  // 店铺搜索
  async searchDoor(params) {
    params.country = params.country || null
    let data = await http.post(this.getLifeSearchList, params)
    let result = {
      page: {
        pageNum: data.data.page.pageNum,
        totalPage: data.data.page.totalPage
      },
      list: []
    }
    let ids = []
    data.data.dataList.forEach(item => {
      ids.push(item.doorId)
      result.list.push(doorAdaptor(item))
    })

    let highDiscount = await this.getHighestDiscount(ids) // 获取最高优惠
    highDiscount = highDiscount.data
    result.list.forEach(item => {
      highDiscount.forEach(high => {
        if (high.doorId === item.doorId) {
          item.maxDiscountPrice = high.maxDiscountPrice
        }
      })
    })
    return result
  }

  // 获取好生活分类
  async getCategory(params) {
    let category = await http.post(this.childCate, params)
    return category.data
  }

// 获取好生活全部分类
  async getLifeCate(params) {
    let category = await http.post(this.getLifeCateUrl, {})
    return category.data
  }
}

export default new PreferredService()

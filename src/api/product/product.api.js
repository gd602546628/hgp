/**
 * Created by guooug on 2017/6/27.
 */
import http from '@/service/common/http/http.service'
import {Codes} from '@/config/config'
import Util from '@/service/common/utils/util.service'
import TimeService from '@/service/time/time.service'
class ProductApi {
  constructor () {
    this.productListUrl = 'door/getPrdList'
    this.productInfoUrl = 'door/getPrdDetail'
    this.doorInfoUrl = 'door/getDoorInfo' // 店铺信息
    this.doorListUrl = 'user/url/getDoorList' // 获取收藏店铺列表
    this.sDDoorUrl = 'user/url/sDDoor' // 收藏店铺列表店铺取消收藏
    this.delPrdUrl = 'user/url/delPrd' // 批量取消收藏商品
    this.getListByDoorIdUrl = 'activity/getListByDoorId' // 发布到店铺的活动列表
    this.getDrawActivityListUrl = 'draw/getDrawActivityList' // 获取店铺抽奖列表
    this.getCateListUrl = 'door/getDoorPrdFcScCates' // 获取店铺一级和二级分类
    this.getPrdListUrl = 'user/url/getPrdList' // 获取收藏的产品列表
  }

  async getProductList (params, option) {
    let data = await http.post(this.productListUrl, params, option)
    if (data.code === Codes.success) {
      /*   data.data.prdList.forEach(item => { // 拿第一张商品的图片
       if (item.prdImg && item.prdImg.length > 1) {
       item.prdImg = item.prdImg[0]
       }
       }) */
      return data.data
    } else {
      return null
    }
  }

  async getProductInfo (params) {
    let data = await http.post(this.productInfoUrl, params).catch(e => {
      throw String('产品详情失败')
    })
    return data
  }

  getMinMaxPrice (product) {
    if (product.priceList) {
      let minPrice = product.priceList[0].price
      let maxPrice = minPrice
      let minDiscountPrice = product.priceList[0].discountPrice
      let maxDiscountPrice = minDiscountPrice
      product.priceList.forEach((item) => {
        if (item.price < minPrice) {
          minPrice = item.price
        }
        if (item.price > maxPrice) {
          maxPrice = item.price
        }
        if (item.discountPrice < minDiscountPrice) {
          minDiscountPrice = item.discountPrice
        }
        if (item.discountPrice > maxDiscountPrice) {
          maxDiscountPrice = item.discountPrice
        }
      })
      return {
        minPrice,
        maxPrice,
        minDiscountPrice,
        maxDiscountPrice
      }
    } else {
      return {}
    }
  }

  /**
   * 判断一个产品是否在促销过程中
   * @param product
   * @returns {boolean}
   */
  isPromotion (product) {
    let result = false
    if (product.priceList) {
      product.priceList.forEach((item) => {
        result = result || this.disTimeout(item.activityInfo) && item.activityInfo.tempStock > 0
        if (result) {
          return true
        }
      })
    }
    return result
  }

  // 获取收藏店铺列表
  async getDoorList (params) {
    let data = await http.post(this.doorListUrl, params, {token: true})
    return data
  }

  // 收藏店铺列表店铺取消收藏
  async getsDDoor (params) {
    let data = await http.post(this.sDDoorUrl, params, {token: true})
    return data
  }

  // 批量取消收藏商品
  async getDelPrd (params) {
    let data = await http.post(this.delPrdUrl, params, {token: true})
    return data
  }

  /**
   * 判断产品的某个规格是否在活动中
   * @param specification
   * @param currentTime
   * @returns {boolean}
   */
  isActivity (specification) {
    let currentTime = TimeService.sysTime()
    let activityInfo = specification.activityInfo // 活动详情
    if (!activityInfo || !activityInfo.tempStock) { // 没有活动 或者是 活动提供的库存为0 直接返回false
      return false
    }
    if (activityInfo.type === 0 && activityInfo.isTime) { // 长期活动
      return specification.isActivity
    }
    let start = 0
    let end = 0
    if (activityInfo.type === 0) {
      start = activityInfo.activityStartTime
      end = activityInfo.activityEndTime
    } else {
      start = activityInfo.seckillStartTime
      end = activityInfo.seckillEndTime
    }
    return Util.compareTime(start, end, currentTime)
  }

  disTimeout (activityInfo) {
    if (activityInfo) {
      let time = null
      if (activityInfo.type === 2) {
        time = activityInfo.seckillEndTime
      } else {
        time = activityInfo.activityEndTime
      }
      let currentTime = TimeService.sysTime()
      time = time || 0
      return TimeService.date(time).getTime() > currentTime
    }
    return false
  }

  getPrice (specification) {
    let isActivity = this.isActivity(specification)
    if (isActivity) {
      let activityInfo = specification.activityInfo
      if (activityInfo) {
        return activityInfo.activityPrice
      }
    } else {
      return specification.discountPrice
    }
  }

  // 发布到店铺的活动列表
  async getListByDoorId (params) {
    let data = await http.post(this.getListByDoorIdUrl, params)
    return data
  }

  // 获取店铺抽奖列表
  async getDrawActivityList (params) {
    let data = await http.post(this.getDrawActivityListUrl, params)
    return data
  }

  // 店铺信息
  async getDoorInfo (params) {
    let data = await http.post(this.doorInfoUrl, params)
    if (data.code === Codes.success) {
      return data.data
    } else {
      return null
    }
  }

  // 获取店铺筛选分类
  async getDoorSelectCategory (params) {
    let data = await http.post(this.getCateListUrl, params).catch(() => {
      throw new Error('链接失败')
    })
    if (data.code !== Codes.success) {
      throw new Error(data.mesg)
    }
    for (let i = 0; i < data.data.fcList.length; i++) {
      data.data.fcList[i].show = false
      data.data.fcList[i].selected = false
      data.data.fcList[i].scList.forEach((item) => {
        item.selected = false
      })
    }
    return data.data.fcList
  }

  // 获取收藏的产品列表
  async getPrdList (params) {
    let data = await http.post(this.getPrdListUrl, params, {token: true})
    data.data.prdList.forEach((item) => {
      item.checked = false
    })
    return data
  }

  isOnline(type){
    return !(type === '1' || type === 1)
  }

}
export default new ProductApi()
